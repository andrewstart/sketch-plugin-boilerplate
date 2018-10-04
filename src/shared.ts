export const WV_TO_PLUGIN_BRIDGE = 'Sketch';
export const PLUGIN_TO_WV_BRIDGE = 'sketchBridge';
export const MESSAGE_TO_WV_CONTEXT = '__eval__';

export interface BridgeMessage {
    name: string;
    payload?: any;
}
