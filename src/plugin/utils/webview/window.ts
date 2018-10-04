import {
    BridgedWebView,
    sendActionToWebView
} from './webview';

interface OpenOptions {
    width?: number;
    height?: number;
    title?: string;
}

// TODO: Update & handle window closing - https://github.com/skpm/sketch-module-web-view/blob/master/lib/set-delegates.js

export function open(identifier:string, path = 'index.html', options:OpenOptions = {}) {
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
    const window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(frame, masks, NSBackingStoreBuffered, false);
    window.setMinSize({width: 200, height: 200});

    // We use this dictionary to have a persistant storage of our NSWindow/NSPanel instance
    // Otherwise the instance is stored nowhere and gets release => Window closes
    const threadDictionary = NSThread.mainThread().threadDictionary();
    threadDictionary[identifier] = window;

    const webView = new BridgedWebView();
    webView.init(path, frame);

    window.title = title;
    window.center();
    window.contentView().addSubview(webView.view);

    window.makeKeyAndOrderFront(null);
}

export function findWebView(identifier:string) {
    const threadDictionary = NSThread.mainThread().threadDictionary();
    const window = threadDictionary[identifier];
    return window.contentView().subviews()[0];
}

export function sendAction(identifier:string, name:string, payload = {}) {
    return sendActionToWebView(findWebView(identifier), name, payload);
}
