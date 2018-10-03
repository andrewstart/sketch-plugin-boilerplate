import { document } from '../core';
import { toArray } from '../formatter';
import { createWebView, sendAction as sendActionToWebView } from './webview';
import Async = require('sketch/async');

log('making new fibers map');
const fibers:Map<string, Async.Fiber> = new Map();

export function toggle(identifier:string, path?:string, width?:OpenOptions) {
    if (isOpen(identifier)) {
        close(identifier);
    } else {
        open(identifier, path, width);
    }
}

interface OpenOptions {
    width?: number;
}
export function open(identifier:string, path = 'index.html', options:OpenOptions = {}) {
    const { width } = options;
    const frame = NSMakeRect(0, 0, width || 250, 600); // the height doesn't really matter here
    const contentView = document.documentWindow().contentView();
    if (!contentView || isOpen(identifier)) {
        return false;
    }
    
    const stageView = (contentView.subviews as ()=>NSArray<NSView>)().objectAtIndex(0);
    const webView = createWebView(path, frame);
    webView.identifier = identifier;
    // don't let the JS context get cleaned up while the panel is open
    const fiber = Async.createFiber();
    fiber.onCleanup(() => {
        removePanel(identifier);
    });
    fibers.set(identifier, fiber);
    
    // Inject our webview into the right spot in the subview list
    const views = (stageView.subviews as ()=>NSArray<NSView>)();
    const finalViews:NSView[] = [];
    let pushedWebView = false;
    for (let i = 0; i < views.count(); i++) {
        const view = views.objectAtIndex(i);
        finalViews.push(view);
        // NOTE: change the view identifier here if you want to add
        //  your panel anywhere else
        if (!pushedWebView && (view.identifier as ()=>string)() == 'view_canvas') {
            finalViews.push(webView);
            pushedWebView = true;
        }
    }
    // If it hasn't been pushed yet, push our web view
    // E.g. when inspector is not activated etc.
    if (!pushedWebView) {
        finalViews.push(webView);
    }
    // Finally, update the subviews prop and refresh
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
    log('Opening panel ' + identifier);
}

export function close(identifier:string) {
    log('Closing panel ' + identifier);
    // Sketch should then call the fiber cleanup callback
    /*if (fibers.has(identifier)) {
        log('telling the fiber to clean up');
        fibers.get(identifier).cleanup();
    }*/
    removePanel(identifier);
}

function removePanel(identifier:string) {
    log('Cleaning up panel ' + identifier);
    const contentView = document.documentWindow().contentView();
    if (!contentView) {
        return false;
    }
    if (fibers.has(identifier)) {
        fibers.delete(identifier);
    }
    // Search for web view panel
    const stageView = (contentView.subviews as ()=>NSArray<NSView>)().objectAtIndex(0);
    const finalViews = toArray((stageView.subviews as ()=>NSArray<NSView>)()).filter(view => {
        return (view.identifier as ()=>string)() != identifier;
    });
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
}

export function isOpen(identifier:string) {
    return !!findWebView(identifier);
}

export function findWebView(identifier:string) {
    const contentView = document.documentWindow().contentView();
    if (!contentView) {
        return null;
    }
    const splitView = (contentView.subviews as ()=>NSArray<NSView>)().objectAtIndex(0);
    const views = toArray((splitView.subviews as ()=>NSArray<NSView>)());
    return views.find(view => (view.identifier as ()=>string)() == identifier) as WKWebView;
}

export function sendAction(identifier:string, name:string, payload:any = {}) {
    return sendActionToWebView(findWebView(identifier), name, payload);
}
