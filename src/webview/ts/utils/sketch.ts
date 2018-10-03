const win = window as (Window & {webkit:{messageHandlers:{Sketch:any}}});

/**
 * Bridge function that allows the plugin to send data to the
 * web view by calling this function.
 * It is globally defined on the window object in index.js!
 */
export const bridge = (jsonString:string) => {
    try {
        const jsonData = jsonString ? JSON.parse(jsonString) : {};
        window.dispatchEvent(new CustomEvent(jsonData.name, {detail: jsonData.payload}));
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
export const sendAction = (name:string, payload:any = {}) => {
    return new Promise((resolve, reject) => {
        if (!check()) {
            reject(new Error('Could not connect to Sketch!'));
        }
        win.webkit.messageHandlers.Sketch.postMessage(JSON.stringify({name, payload}));
        resolve();
    });
};
