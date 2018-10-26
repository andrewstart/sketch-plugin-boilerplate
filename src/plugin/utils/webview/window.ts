import { BridgedWebView, sendActionToWebView } from './webview';
import {MESSAGE_TO_WV_CONTEXT} from '../../../shared';
import ObjCClass from 'cocoascript-class';

export interface WindowOpenOptions {
    width?: number;
    height?: number;
    title?: string;
}

export abstract class Window extends BridgedWebView {
    /**
     * Must be overridden so that you can do things when something happens in the panel.
     */
    protected abstract onActionReceived(name:string, payload:any):any;
    /**
     * Must be overridden by subclasses.
     */
    protected static IDENTIFIER:string = 'default-panel-id';
    /**
     * Override this in subclasses if desired.
     */
    protected static path:string = 'webview/index.html';// relative to Contents/Resources in plugin
    /**
     * Override this in subclasses if desired.
     */
    protected static openOptions:WindowOpenOptions = {width:450, height:350, title: 'Boilerplate Window'};
    
    public static open() {
        // create a new window. This shouldn't get garbage collected.
        const window = new (this as any)();
    }
    
    public static close() {
        // send message to the original JS context that created the view and tell it to clean up
        sendActionToWindow(this.IDENTIFIER, MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()');
    }
    
    public static sendAction(name:string, payload:any = {}) {
        sendActionToWindow(this.IDENTIFIER, name, payload);
    }
    
    // Actually an NSPanel/NSWindow
    private window:any;
    
    constructor() {
        super();
        this.open((this.constructor as typeof Window).IDENTIFIER,
            (this.constructor as typeof Window).path,
            (this.constructor as typeof Window).openOptions);
    }
    
    /**
     * Is called by the constructor.
     */
    protected open(identifier:string, path:string, options:WindowOpenOptions) {
        // Sensible defaults for options
        const {
            width = 450,
            height = 350,
            title = 'Sketch Plugin Boilerplate'
        } = options;

        const frame = NSMakeRect(0, 0, width, height);
        const masks = NSTitledWindowMask |
            NSWindowStyleMaskClosable |
            NSResizableWindowMask;
        this.window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, masks, NSBackingStoreBuffered, false);
        this.window.setMinSize({width: 200, height: 200});

        // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
        // Otherwise the instance is stored nowhere and gets release => Window closes
        const threadDictionary = NSThread.mainThread().threadDictionary();
        threadDictionary[identifier] = this.window;

        this.init(path, frame);
        
        this.window.title = title;
        this.window.center();
        this.window.contentView().addSubview(this.view);

        this.window.makeKeyAndOrderFront(null);
        
        // if the fiber gets cleaned up, remove the panel
        this.fiber.onCleanup(() => {
            // don't double clean up
            if (!this.fiber) {
                return;
            }
            // clear the fiber reference so that it doesn't get far when triggered again
            this.fiber = null;
            if (this.window) {
                // close the panel, if it wasn't already closed
                const w = this.window;
                this.window = null;
                w.close();
            }
        });
        // set up a listener for window close, so we can accurately kill the fiber for this
        // every JS class gets it's own copy of ObjCClass because I have yet to figure out how
        // to set up callbacks on a per JS class basis
        const WindowCloseDelegate = ObjCClass({
            'windowWillClose:': () => {
                if (this.fiber) {
                    // don't want to attempt to call close() on the window, so
                    // we will null the var
                    this.window = null;
                    // release the JS context
                    this.fiber.cleanup();
                }
            },
        });
        this.window.setDelegate(WindowCloseDelegate.new());
    }
}

export function findWindow(identifier:string) {
    const threadDictionary = NSThread.mainThread().threadDictionary();
    const window = threadDictionary[identifier];
    return window.contentView().subviews()[0];
}

export function sendActionToWindow(identifier:string, name:string, payload:any = {}) {
    return sendActionToWebView(findWindow(identifier), name, payload);
}
