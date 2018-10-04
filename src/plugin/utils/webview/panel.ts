import { document } from '../core';
import { toArray } from '../formatter';
import { BridgedWebView, sendActionToWebView, getFilePath } from './webview';
import {MESSAGE_TO_WV_CONTEXT} from '../../../shared';
import Settings = require('sketch/settings');
import Dom = require('sketch/dom');

const OPEN_PANELS_KEY = 'open-panels';
interface OpenPanelData {
    id: string;
    path: string;
    options: OpenOptions;
}

export function toggle(identifier:string, path?:string, width?:OpenOptions) {
    if (isOpen(identifier)) {
        close(identifier);
    } else {
        open(identifier, path, width);
    }
}

/**
 * Closes active panels in the current document.
 */
export function closeActivePanels():void {
    const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    for (const panel of panels) {
        close(panel.id, false);
    }
}

export function openCurrentPanels():void {
    const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    for (const panel of panels) {
        openPanel(panel.id, panel.path, panel.options);
    }
}

let webview:BridgedWebView = null;

interface OpenOptions {
    width?: number;
}
export function open(identifier:string, path = 'index.html', options:OpenOptions = {}, openForAll:boolean = true) {
    // get an absolute path
    path = getFilePath(path);
    if (openForAll) {
        // note that we opened this panel
        const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
        if (!panels.find(panel => panel.id == identifier)) {
            panels.push({id: identifier, options, path});
            Settings.setSettingForKey(OPEN_PANELS_KEY, panels);
        }
        // for each open document, open the panel
        Dom.getDocuments().forEach((doc) => {
            openPanel(identifier, path, options, doc.sketchObject);
        });
    } else {
        openPanel(identifier, path, options);
    }
}

function openPanel(identifier:string, path:string, options:OpenOptions, doc?:MSDocument) {
    const { width } = options;
    const frame = NSMakeRect(0, 0, width || 250, 600); // the height doesn't really matter here
    doc = doc || document;
    if (!doc) {
        console.warn('Trying to open panel in document, but no document');
        return;
    }
    if (!doc.documentWindow()) {
        console.warn('Trying to open panel in document, but no document window');
        return;
    }
    const contentView = doc.documentWindow().contentView();
    if (!contentView || findWebView(identifier, doc)) {
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
    
    // TODO: Expose this for more general use
    webview.onActionReceived = (name, payload) => {
        console.log('Received ', name, payload);
    };
    
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

export function close(identifier:string, closeForAll:boolean = true) {
    if (closeForAll) {
        // record the panel as closed
        const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
        if (panels.find(panel => panel.id == identifier)) {
            Settings.setSettingForKey(OPEN_PANELS_KEY, panels.filter(panel => panel.id != identifier));
        }
        // for each open document, close the panel
        Dom.getDocuments().forEach((doc) => {
            sendAction(identifier, MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()', doc.sketchObject);
        });
    } else {
        // close just the current document
        // send message to the original JS context that created the view and tell it to clean up
        sendAction(identifier, MESSAGE_TO_WV_CONTEXT, 'this.fiber.cleanup()');
    }
}

function removePanel(identifier:string) {
    // Search for web view panel
    const view = findWebView(identifier);
    if (view) {
        (view as any).removeFromSuperview();
    }
    // clear variable for good measure
    webview = null;
}

export function isOpen(identifier:string) {
    const panels:OpenPanelData[] = Settings.settingForKey(OPEN_PANELS_KEY) || [];
    return !!panels.find(panel => panel.id == identifier);
}

export function findWebView(identifier:string, doc?:MSDocument) {
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

export function sendAction(identifier:string, name:string, payload:any = {}, document?:MSDocument) {
    return sendActionToWebView(findWebView(identifier, document), name, payload);
}
