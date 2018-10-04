import './app';
import {PLUGIN_TO_WV_BRIDGE} from '../../shared';
import { bridge } from './utils/sketch';

// expose bridge for the plugin to call from outside the webview
(window as any)[PLUGIN_TO_WV_BRIDGE] = bridge;
