import { document } from '../core';
import { toArray } from '../formatter';
import { BridgedWebView, sendActionToWebView } from './webview';
import {MESSAGE_TO_WV_CONTEXT} from '../../../shared';

export function toggle(identifier:string, path?:string, width?:OpenOptions) {
    if (isOpen(identifier)) {
        close(identifier);
    } else {
        open(identifier, path, width);
    }
}

// TODO: Handle document closing (fiber should get released, probably)

let webview:BridgedWebView = null;

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
    webview = new BridgedWebView();
    webview.init(path, frame);
    webview.view.identifier = identifier;
    // if the fiber gets cleaned up, remove the panel
    webview.fiber.onCleanup(() => {
        // don't double clean up
        if (!webview) {
            return;
        }
        // clear the fiber reference so that it doesn't get far when triggered again
        webview.fiber = null;
        // remove the panel from the document
        removePanel(identifier);
    });
    
    // Inject our webview into the right spot in the subview list
    const views = (stageView.subviews as ()=>NSArray<NSView>)();
    const finalViews:NSView[] = [];
    let pushedWebView = false;
    for (let i = 0; i < views.count(); i++) {
        const view = views.objectAtIndex(i);
        finalViews.push(view);
        // NOTE: change the view identifier here if you want to add
        //  your panel anywhere else - view_canvas is the document area
        if (!pushedWebView && (view.identifier as ()=>string)() == 'view_canvas') {
            finalViews.push(webview.view);
            pushedWebView = true;
        }
    }
    // If it hasn't been pushed yet, push our web view
    // E.g. when inspector is not activated etc.
    if (!pushedWebView) {
        finalViews.push(webview.view);
    }
    // Finally, update the subviews prop and refresh
    stageView.subviews = finalViews;
    stageView.adjustSubviews();
}

export function close(identifier:string) {
    // send message to the original JS context that created the view and tell it to clean up
    sendAction(identifier, MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()');
}

function removePanel(identifier:string, actuallyRemove = true) {
    const contentView = document.documentWindow().contentView();
    if (!contentView) {
        return false;
    }
    // Search for web view panel
    const view = findWebView(identifier);
    if (view) {
        (view as any).removeFromSuperview();
    }
    // clear variable for good measure
    webview = null;
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
