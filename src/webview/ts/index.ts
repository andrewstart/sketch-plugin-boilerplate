import './app';
import { bridge as sketchBridge } from './utils/sketch';

// expose bridge for the plugin to call from outside the webview
(window as any).sketchBridge = sketchBridge;
