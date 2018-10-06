/**
 * Name of message handler on the webview for sending messages from the webview
 * to the context that created it.
 */
export const WV_TO_PLUGIN_BRIDGE = 'Sketch';
/**
 * Name of window property inside webview for sending messages to the webview.
 */
export const PLUGIN_TO_WV_BRIDGE = 'sketchBridge';
/**
 * Name of message that should be evaluated on the context that created the webview.
 */
export const MESSAGE_TO_WV_CONTEXT = '__eval__';

export interface BridgeMessage {
    name: string;
    payload?: any;
}
