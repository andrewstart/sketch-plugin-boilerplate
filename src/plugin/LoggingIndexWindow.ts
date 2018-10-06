import {Window} from './utils/webview';

export default class LoggingIndexWindow extends Window {
    static IDENTIFIER = 'Boilerplate-Index-Window';
    static path:string = 'webview/index.html';// relative to Contents/Resources in plugin
    static openOptions = {
        title: 'Boilerplate Logging Window (see dev tools)',
        width: 400,
        height: 400
    };
    onActionReceived(name:string, payload:any):void {
        console.log('Received from window', name, payload);
    }
}
