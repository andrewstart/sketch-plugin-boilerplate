/// <reference types="sketch.d.ts" />
import { initWithContext, document } from './utils/core';
import * as WebViewUtils from './utils/webview';

// All exported functions will be exposed as entry points to your plugin
// and can be referenced in your `manifest.json`

export function helloWorld(context:SketchContext) {
    initWithContext(context);
    document.showMessage('👋🌏 Hello World!');
}

export function openWindow(context:SketchContext) {
    // It's good practice to have an init function, that can be called
    // at the beginning of all entry points and will prepare the enviroment
    // using the provided `context`
    initWithContext(context);
    WebViewUtils.openWindow(WebViewUtils.windowIdentifier);
}

export function togglePanel(context:SketchContext) {
    initWithContext(context);
    WebViewUtils.togglePanel(WebViewUtils.panelIdentifier);
}

export function sendMessageToWindow(context:SketchContext) {
    initWithContext(context);
    WebViewUtils.sendWindowAction(WebViewUtils.windowIdentifier, 'foo', {foo: 'bar'});
}

export function sendMessageToPanel(context:SketchContext) {
    initWithContext(context);
    WebViewUtils.sendPanelAction(WebViewUtils.panelIdentifier, 'foo', {foo: 'bar'});
}
