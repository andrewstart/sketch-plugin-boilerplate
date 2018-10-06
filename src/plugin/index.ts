/// <reference types="sketch.d.ts" />
/// <reference types="../../typings/skpm" />
import { initWithContext } from './utils/core';
import * as WebViewUtils from './utils/webview';
import LoggingIndexPanel from './LoggingIndexPanel';
import LoggingIndexWindow from './LoggingIndexWindow';
import Dom = require('sketch/dom');

// All exported functions will be exposed as entry points to your plugin
// and can be referenced in your `manifest.json`
export function openWindow(context:SketchContext) {
    // It's good practice to have an init function, that can be called
    // at the beginning of all entry points and will prepare the enviroment
    // using the provided `context`
    initWithContext(context);
    LoggingIndexWindow.open();
}
export function closeWindow(context:SketchContext) {
    // It's good practice to have an init function, that can be called
    // at the beginning of all entry points and will prepare the enviroment
    // using the provided `context`
    initWithContext(context);
    LoggingIndexWindow.close();
}

export function togglePanel(context:SketchContext) {
    initWithContext(context);
    LoggingIndexPanel.toggle();
}

export function sendMessageToWindow(context:SketchContext) {
    initWithContext(context);
    LoggingIndexWindow.sendAction('foo', {foo: 'bar'});
}

export function sendMessageToPanel(context:SketchContext) {
    initWithContext(context);
    LoggingIndexPanel.sendAction('foo', {foo: 'bar'});
}

// exported for OpenDocument action - final project should have this if using panels
export function openActivePanels(context:SketchContext) {
    // document might not be ready, so wait a short bit
    setTimeout(() => {
        if (!context.document) {
            context.document = Dom.getSelectedDocument().sketchObject;
        }
        initWithContext(context);
        WebViewUtils.openActivePanels();
    }, 250);
}
