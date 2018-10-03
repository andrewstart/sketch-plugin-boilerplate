import { pluginFolderPath, document } from '../core';
import ObjCClass from 'cocoascript-class';

// These are just used to identify the window(s)
// Change them to whatever you need e.g. if you need to support multiple
// windows at the same time...
const windowIdentifier = 'sketch-plugin-boilerplate--window';
const panelIdentifier = 'sketch-plugin-boilerplate--panel';

// store delegate so that we don't recreate it if the JS context hasn't been unloaded
let BridgeMessageHandler = null;

function createBridgeHandler() {
    if (BridgeMessageHandler) {
        return;
    }
    // This is a helper delegate, that handles incoming bridge messages
    BridgeMessageHandler = new ObjCClass({
        'userContentController:didReceiveScriptMessage:'(_controller, message) {
            require('sketch/ui').message('Received a message!');
            try {
                const bridgeMessage = JSON.parse(String(message.body()));
                receiveAction(bridgeMessage.name, bridgeMessage.data);
            } catch (e) {
                log('Could not parse bridge message');
                log(e.message);
            }
        }
    });

    /*
    log('BridgeMessageHandler');
    log(BridgeMessageHandler);
    log(BridgeMessageHandler.userContentController_didReceiveScriptMessage);
    */
}

export function initBridgedWebView(frame:NSRect, bridgeName = 'Sketch'):WKWebView {
    const config = WKWebViewConfiguration.alloc().init();
    // enable right click -> inspect element
    config.preferences()._developerExtrasEnabled = true;
    // ensure that the BridgeMessageHandler class exists
    createBridgeHandler();
    const messageHandler = BridgeMessageHandler.alloc().init();
    config.userContentController().addScriptMessageHandler_name(messageHandler, bridgeName);
    return WKWebView.alloc().initWithFrame_configuration(frame, config);
}

export function getFilePath(file) {
    return `${pluginFolderPath}/Contents/Resources/webview/${file}`;
}

export function createWebView(path:string, frame:NSRect) {
    const webView = initBridgedWebView(frame, 'Sketch');
    const url = NSURL.fileURLWithPath(getFilePath(path));
    log('File URL');
    log(url);
    
    webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable);
    webView.loadRequest(NSURLRequest.requestWithURL(url));
    
    return webView;
}

export function sendAction(webView:WKWebView, name:string, payload:any = {}) {
    if (!webView || !webView.evaluateJavaScript_completionHandler) {
        return;
    }
    // `sketchBridge` is the JS function exposed on window in the webview!
    const script = `sketchBridge('${JSON.stringify({name, payload})}');`;
    webView.evaluateJavaScript_completionHandler(script, null);
}

export function receiveAction(name:string, payload:any = {}) {
    document.showMessage('I received a message! 😊🎉🎉');
}

export {
    windowIdentifier,
    panelIdentifier
};
