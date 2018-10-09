import { document } from '../core';
import { toArray } from '../formatter';
import { BridgedWebView, sendActionToWebView } from './webview';
import {MESSAGE_TO_WV_CONTEXT} from '../../../shared';
import Settings = require('sketch/settings');
import Dom = require('sketch/dom');
import ObjCClass from 'cocoascript-class';

const OPEN_PANELS_KEY = 'open-panels';
interface OpenPanelData {
    id: string;
}

/**
 * Closes active panels in the current document.
 */
export function closeActivePanels():void {
    const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    for (const panel of panels) {
        RegisteredPanels.get(panel.id).close(false);
    }
}

/**
 * opens active panels in the current document.
 */
export function openActivePanels():void {
    const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    for (const panel of panels) {
        const constructor:any = RegisteredPanels.get(panel.id);
        // create a new instance of that panel for the document.
        // presumably this won't get garbage collected
        const p = new constructor();
    }
}

// registered panels so we can create them reactively
const RegisteredPanels = new Map<string, typeof Panel>();

export interface PanelOpenOptions {
    width?: number;
    height?: number;
}

export enum PanelLocation {
    RightOfDocument,
    LeftOfDocument,
    /** Not supported yet */
    LeftPane
}

let WindowCloseDelegate:any;

/**
 * Subclass and register to perform actions upon messages from the panel.
 */
export abstract class Panel extends BridgedWebView {
    /**
     * Must be overridden so that you can do things when something happens in the panel.
     */
    protected abstract onActionReceived(name:string, payload:any):any;
    /**
     * Must be overridden by subclasses.
     */
    protected static IDENTIFIER:string = 'default-panel-id';
    /**
     * Must be called by developer upon subclasses.
     */
    public static register() {
        RegisteredPanels.set(this.IDENTIFIER, this);
    }
    /**
     * Override this in subclasses if desired.
     */
    protected static path:string = 'webview/index.html';// relative to Contents/Resources in plugin
    /**
     * Override this in subclasses if desired.
     */
    protected static openOptions:PanelOpenOptions = {width:250, height:40};
    /**
     * Override this in subclasses if desired.
     */
    protected static location:PanelLocation = PanelLocation.RightOfDocument;
    /**
     * The document that this panel is attached to (may be different from document in script context).
     */
    protected document:MSDocument = null;
    
    constructor(doc?:MSDocument) {
        super();
        this.document = doc || document;
        this.open((this.constructor as typeof Panel).IDENTIFIER,
            (this.constructor as typeof Panel).path,
            (this.constructor as typeof Panel).openOptions,
            (this.constructor as typeof Panel).location);
    }
    
    /**
     * Opens this panel for all documents.
     */
    public static open() {
        // note that we opened this panel
        const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
        if (!panels.find(panel => panel.id == this.IDENTIFIER)) {
            panels.push({id: this.IDENTIFIER});
            Settings.setSettingForKey(OPEN_PANELS_KEY, panels);
        }
        // for each open document, open this panel (should be called as Subclass.open())
        Dom.getDocuments().forEach((doc) => {
            // create a new instance of that panel for the document.
            // presumably this won't get garbage collected
            const panel = new (this as any)(doc.sketchObject);
        });
    }
    
    /**
     * Closes this panel. Optionally only close this panel in the current document (for cleanup)
     */
    public static close(closeForAll:boolean = true) {
        if (closeForAll) {
            // record the panel as closed
            const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
            if (panels.find(panel => panel.id == this.IDENTIFIER)) {
                Settings.setSettingForKey(OPEN_PANELS_KEY, panels.filter(panel => panel.id != this.IDENTIFIER));
            }
            // for each open document, close the panel
            Dom.getDocuments().forEach((doc) => {
                sendActionToPanel(this.IDENTIFIER, MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()', doc.sketchObject);
            });
        } else {
            // close just the current document
            // send message to the original JS context that created the view and tell it to clean up
            sendActionToPanel(this.IDENTIFIER, MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()');
        }
    }
    
    /**
     * Opens or closes this panel for all documents.
     */
    public static toggle() {
        if (isOpen(this.IDENTIFIER)) {
            this.close();
        } else {
            this.open();
        }
    }
    
    /**
     * Send an action to this panel.
     */
    public static sendAction(name:string, payload:any = {}, document?:MSDocument) {
        sendActionToPanel(this.IDENTIFIER, name, payload, document);
    }
    
    /**
     * Is called by the constructor.
     */
    protected open(identifier:string, path:string, options:PanelOpenOptions, location:PanelLocation) {
        const width = options.width || 250;
        const height = options.height || 40;
        // the height doesn't really matter here, unless going in the left panel
        const frame = NSMakeRect(0, 0, width, height);
        if (!this.document) {
            console.warn('Trying to open panel in document, but no document');
            return;
        }
        if (!this.document.documentWindow()) {
            console.warn('Trying to open panel in document, but no document window');
            return;
        }
        const contentView = this.document.documentWindow().contentView();
        if (!contentView || findPanel(identifier, this.document)) {
            return;
        }
        
        this.init(path, frame);
        this.view.identifier = identifier;
        // if the fiber gets cleaned up, remove the panel
        this.fiber.onCleanup(() => {
            // don't double clean up
            if (!this.fiber) {
                return;
            }
            // clear the fiber reference so that it doesn't get far when triggered again
            this.fiber = null;
            // remove the panel from the document
            this.removePanel();
        });
        // set up a listener for window close, so we can accurately kill the fiber for this
        // panel when the document is closed (document close event isn't good enough sometimes)
        if (!WindowCloseDelegate) {
            WindowCloseDelegate = ObjCClass({
                'windowWillClose:': () => {
                    if (this.fiber) {
                        this.fiber.cleanup();
                    }
                },
            });
        }
        (this.document.documentWindow() as any).setDelegate(WindowCloseDelegate.new());
        
        switch (location) {
            case PanelLocation.RightOfDocument:
                this.addToStage();
                break;
            case PanelLocation.LeftOfDocument:
                this.addToStage(true);
                break;
            case PanelLocation.LeftPane:
                console.error('Placement in the left pane is not supported yet');
                break;
        }
    }
    
    private addToStage(leftOfDocument:boolean = false) {
        const contentView = this.document.documentWindow().contentView();
        const stageView = (contentView.subviews as ()=>NSArray<NSView>)().objectAtIndex(0);
        // Inject our webview into the right spot in the subview list
        const views = (stageView.subviews as ()=>NSArray<NSView>)();
        const finalViews:NSView[] = [];
        let pushedWebView = false;
        for (let i = 0; i < views.count(); i++) {
            const view = views.objectAtIndex(i);
            // NOTE: change the view identifier here if you want to add
            //  your panel anywhere else - view_canvas is the document area
            if ((view.identifier as ()=>string)() == 'view_canvas') {
                if (!pushedWebView && leftOfDocument) {
                    finalViews.push(this.view);
                    pushedWebView = true;
                }
                finalViews.push(view);
                if (!pushedWebView && !leftOfDocument) {
                    finalViews.push(this.view);
                    pushedWebView = true;
                }
            } else {
                finalViews.push(view);
            }
        }
        // If it hasn't been pushed yet, push our web view
        // E.g. when inspector is not activated etc.
        if (!pushedWebView) {
            finalViews.push(this.view);
        }
        // Finally, update the subviews prop and refresh
        stageView.subviews = finalViews;
        stageView.adjustSubviews();
    }
    
    private removePanel() {
        if (this.view) {
            (this.view as any).removeFromSuperview();
        }
    }
}

/**
 * Determines if a panel is (should be) open, based on saved settings.
 * Does not determine if the panel is open in a given document.
 */
export function isOpen(identifier:string) {
    const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    return !!panels.find(panel => panel.id == identifier);
}

/**
 * Find a webview attached to a given (or the current) document.
 */
export function findPanel(identifier:string, doc?:MSDocument) {
    doc = doc || document;
    if (!doc || !doc.documentWindow()) {
        return null;
    }
    const contentView = (doc || document).documentWindow().contentView();
    if (!contentView) {
        return null;
    }
    const splitView = (contentView.subviews as ()=>NSArray<NSView>)().objectAtIndex(0);
    const views = toArray((splitView.subviews as ()=>NSArray<NSView>)());
    return views.find(view => (view.identifier as ()=>string)() == identifier) as WKWebView;
}

/**
 * Send an action to a panel.
 */
export function sendActionToPanel(identifier:string, name:string, payload:any = {}, document?:MSDocument) {
    sendActionToWebView(findPanel(identifier, document), name, payload);
}
