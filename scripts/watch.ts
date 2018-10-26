process.env.NODE_ENV = 'development';

import fs = require('fs-extra');
import chalk from 'chalk';
import clear = require('clear');

import { logError, observe } from './utils/build';

import buildPlugin, {copyPluginAssets} from './plugin/build';
import buildWebView from './webview/build';
import pluginPaths from '../config/plugin/paths';
import webviewPaths from '../config/webview/paths';

let watching = false;
let timer:NodeJS.Timer = null;

const finalBuilder = createWatchCallback(buildPlugin, 5);
const paths = [
    {
        path: pluginPaths.src,
        cb: finalBuilder
    },
    {
        path: pluginPaths.frameworks,
        cb: finalBuilder
    },
    {
        path: pluginPaths.assetsSrc,
        cb: createWatchCallback(copyPluginAssets, 4, finalBuilder)
    },
    {
        path: webviewPaths.src,
        cb: createWatchCallback(buildWebView, 3, finalBuilder)
    }
];

const buildQueue:{buildFunc:()=>Promise<void>, priority:number}[] = [
    // first build starts up by removing previous build
    {
        buildFunc: async () => {
            await fs.emptyDir(pluginPaths.assets);
            await fs.remove(pluginPaths.bundle);
            console.log('✓ Removed old build...');
        },
        priority: 0
    },
    {
        buildFunc: buildWebView,
        priority: 3
    },
    {
        buildFunc: copyPluginAssets,
        priority: 4
    },
    {
        buildFunc: buildPlugin,
        priority: 5
    }
];

// Run build
build();

async function build() {
    clear();
    console.log(chalk.bold('Create development build and watch'));
    console.log();
    
    // Clear interval on rebuild, to set new interval
    // in observer
    clearInterval(timer);
    timer = null;
    
    try {
        while(buildQueue.length) {
            const item = buildQueue.shift();
            await item.buildFunc();
        }
    }
    catch (error) {
        logError(error);
        clearInterval(timer);
        return;
    }
    timer = observe({
        interval: 10000,
        watching,
        paths
    });
    watching = true;
}

function createWatchCallback(cb:()=>Promise<void>, priority:number, additional?:()=>void) {
    return function() {
        // if item isn't already in the build queue, then add it in to the list
        if (!buildQueue.find(item => item.buildFunc === cb)) {
            buildQueue.push({buildFunc: cb, priority});
            // sort the list by priority
            buildQueue.sort((a, b) => {
                return a.priority - b.priority;
            });
            // if not currently building, start rebuilding
            if (timer) {
                build();
            }
            if (additional) {
                additional();
            }
        }
    };
}
