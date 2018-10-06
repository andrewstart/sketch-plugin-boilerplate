import { pluginFolderPath } from '../core';
import ObjCClass from 'cocoascript-class';
import Async = require('sketch/async');
import {WV_TO_PLUGIN_BRIDGE, PLUGIN_TO_WV_BRIDGE, MESSAGE_TO_WV_CONTEXT, BridgeMessage} from '../../../shared';

export function getFilePath(file:string) {
    return `${pluginFolderPath}/Contents/Resources/${file}`;
}

export function sendActionToWebView(webView:WKWebView, name:string, payload:any = {}) {
    if (!webView || !webView.evaluateJavaScript_completionHandler) {
        return;
    }
    // call the JS function exposed on window in the webview!
    const script = `${PLUGIN_TO_WV_BRIDGE}('${JSON.stringify({name, payload})}');`;
    webView.evaluateJavaScript_completionHandler(script, null);
}

// variables for ObjectiveC classes, in case we make more than one in a JS context
let BridgeMessageHandler:any = null;
let ViewClass:any = null;

export abstract class BridgedWebView {
    /**
     * Must be overridden so that panels can be recreated automatically for new windows.
     */
    protected abstract onActionReceived(name:string, payload:any):any;
    public fiber:Async.Fiber = null;
    public view:WKWebView = null;
    
    protected init(path:string, frame:NSRect):void {
        const webView = this.createView(frame);
        const url = path.startsWith('http') ? NSURL.URLWithString(path) : NSURL.fileURLWithPath(getFilePath(path));
        
        webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
        webView.loadRequest(NSURLRequest.requestWithURL(url));
        this.view = webView;
        // don't let the JS context get cleaned up while the panel is open
        // consumers of the webview should add their own callbacks (to remove panel/close window)
        this.fiber = Async.createFiber();
    }
    
    private createView(frame:NSRect):WKWebView {
        const config = WKWebViewConfiguration.alloc().init();
        // enable right click -> inspect element
        config.preferences()._developerExtrasEnabled = true;
        // This is a helper delegate, that handles incoming bridge messages
        if (!BridgeMessageHandler) {
            BridgeMessageHandler = ObjCClass({
                'userContentController:didReceiveScriptMessage:':(_controller, message) => {
                    try {
                        const bridgeMessage:BridgeMessage = JSON.parse(String(message.body()));
                        this.receiveAction(bridgeMessage.name, bridgeMessage.payload);
                    } catch (e) {
                        console.log('Could not parse bridge message', e, message.body());
                    }
                }
            });
        }
        const messageHandler = BridgeMessageHandler.alloc().init();
        config.userContentController().addScriptMessageHandler_name(messageHandler, WV_TO_PLUGIN_BRIDGE);
        
        if (!ViewClass) {
            ViewClass = ObjCClass({
                classname: 'WebViewWrapper',
                superclass: WKWebView,
                ['viewWillMoveToSuperview:']: (view:NSView|null) => {
                    if (!view && this.fiber) {
                        this.fiber.cleanup();
                    }
                }
            });
        }
        return ViewClass.alloc().initWithFrame_configuration(frame, config);
    }

    private receiveAction(name:string, payload:any = {}) {
        if (name == MESSAGE_TO_WV_CONTEXT) {
            try {
                const func = new Function(payload);
                func.call(this);
            } catch (e) {
                console.warn('Unable to evaluate message to plugin', e, payload);
            }
            return;
        }
        if (this.onActionReceived) {
            try {
                this.onActionReceived(name, payload);
            } catch (e) {
                console.warn('Unable to perform action received callback', e, payload);
            }
        }
    }
}
