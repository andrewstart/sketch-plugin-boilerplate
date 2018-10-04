(function () {
    'use strict';

    

    function __$styleInject(css, returnValue) {
      if (typeof document === 'undefined') {
        return returnValue;
      }
      css = css || '';
      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';
      head.appendChild(style);
      
      if (style.styleSheet){
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      return returnValue;
    }

    const WV_TO_PLUGIN_BRIDGE = 'Sketch';
    const PLUGIN_TO_WV_BRIDGE = 'sketchBridge';
    const MESSAGE_TO_WV_CONTEXT = '__eval__';

    const win = window;
    /**
     * Bridge function that allows the plugin to send data to the
     * web view by calling this function.
     * It is globally defined on the window object in index.js!
     */
    const bridge = (jsonString) => {
        try {
            const jsonData = jsonString ? JSON.parse(jsonString) : {};
            if (jsonData.name === MESSAGE_TO_WV_CONTEXT) {
                // send to the original context that created this webview
                sendAction(jsonData.name, jsonData.payload);
            }
            else {
                window.dispatchEvent(new CustomEvent(jsonData.name, { detail: jsonData.payload }));
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    /**
     * Check if message handler is available
     * The message handler gets registered with the config we use
     * in the plugin to create the web view
     */
    const check = () => {
        return win.webkit &&
            win.webkit.messageHandlers &&
            win.webkit.messageHandlers.Sketch;
    };
    /**
     * Send message to plugin using the message handler
     * Uses promise structure
     */
    const sendAction = (name, payload) => {
        return new Promise((resolve, reject) => {
            if (!check()) {
                reject(new Error('Could not connect to Sketch!'));
            }
            const data = { name, payload };
            win.webkit.messageHandlers[WV_TO_PLUGIN_BRIDGE].postMessage(JSON.stringify(data));
            resolve();
        });
    };

    __$styleInject("/**\n * Please don't do this in a production plugin, you should try\n * to think offline first! :)\n */\n@import url(\"https://fonts.googleapis.com/css?family=Lato\");\nbody {\n  margin: 0;\n  padding: 0; }\n\n.app {\n  padding: 30px;\n  font-size: 14px;\n  line-height: 1.5;\n  text-align: center;\n  font-family: Lato, Open Sans, sans-serif; }\n  .app .logo {\n    width: 100px; }\n  .app .app-content {\n    text-align: left; }\n  .app code, .app pre {\n    font-size: 90%;\n    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;\n    background: none #f5f5f5; }\n  .app pre {\n    padding: 7px;\n    overflow: auto; }\n");

    document.querySelector('button').onclick = () => {
        sendAction('foo', { foo: 'bar' });
        const pre = document.createElement('pre');
        pre.append('SENT: ' + JSON.stringify({ name: 'foo', payload: { foo: 'bar' } }, null, 2));
        document.querySelector('.app-content').appendChild(pre);
    };
    window.addEventListener('foo', (ev) => {
        const pre = document.createElement('pre');
        pre.append('RECEIVED: ' + JSON.stringify(ev.detail, null, 2));
        document.querySelector('.app-content').appendChild(pre);
    });

    // expose bridge for the plugin to call from outside the webview
    window[PLUGIN_TO_WV_BRIDGE] = bridge;

}());
