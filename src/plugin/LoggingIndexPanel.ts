import {Panel} from './utils/webview';

export default class LoggingIndexPanel extends Panel {
    static IDENTIFIER = 'Boilerplate-Index-Panel';
    static path:string = 'webview/index.html';// relative to Contents/Resources in plugin
    onActionReceived(name:string, payload:any):void {
        console.log('Received ', name, payload);
    }
}

LoggingIndexPanel.register();
