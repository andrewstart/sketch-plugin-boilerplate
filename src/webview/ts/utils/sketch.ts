import {WV_TO_PLUGIN_BRIDGE, MESSAGE_TO_WV_CONTEXT, BridgeMessage} from '../../../shared';

const win = window as (Window & {webkit:{messageHandlers:{Sketch:any}}});

/**
 * Bridge function that allows the plugin to send data to the
 * web view by calling this function.
 * It is globally defined on the window object in index.js!
 */
export const bridge = (jsonString:string) => {
    try {
        const jsonData:BridgeMessage = jsonString ? JSON.parse(jsonString) : {};
        if (jsonData.name === MESSAGE_TO_WV_CONTEXT) {
            // send to the original context that created this webview
            sendAction(jsonData.name, jsonData.payload);
        } else {
            window.dispatchEvent(new CustomEvent(jsonData.name, {detail: jsonData.payload}));
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * Check if message handler is available
 * The message handler gets registered with the config we use
 * in the plugin to create the web view
 */
export const check = () => {
    return win.webkit &&
    win.webkit.messageHandlers &&
    win.webkit.messageHandlers.Sketch;
};

/**
 * Send message to plugin using the message handler
 * Uses promise structure
 */
export const sendAction = (name:string, payload?:any) => {
    return new Promise((resolve, reject) => {
        if (!check()) {
            reject(new Error('Could not connect to Sketch!'));
        }
        const data:BridgeMessage = {name, payload};
        win.webkit.messageHandlers[WV_TO_PLUGIN_BRIDGE].postMessage(JSON.stringify(data));
        resolve();
    });
};
