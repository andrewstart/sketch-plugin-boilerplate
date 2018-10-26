if (process.argv.includes('--prod')) {
    process.env.NODE_ENV = 'production';
}

import fs = require('fs-extra');
import chalk from 'chalk';
import { logError } from './utils/build';

import buildPlugin, {copyPluginAssets} from './plugin/build';
import buildWebView from './webview/build';
import pluginPaths from '../config/plugin/paths';

main()
.catch((err) => {
    logError(err);
});

async function main() {
    if (process.argv.includes('--prod')) {
        console.log(chalk.bold('Create production build'));
    }
    else {
        console.log(chalk.bold('Create debug build'));
    }
    console.log();
    
    await fs.emptyDir(pluginPaths.assets);
    await fs.remove(pluginPaths.bundle);
    console.log('✓ Removed old build...');

    await buildWebView();
    await copyPluginAssets();
    await buildPlugin();
    console.log(chalk.green.bold('✓ FINISHED BUILD '));
    console.log(chalk.green('You can find the plugin bundle in ' + chalk.italic(pluginPaths.bundle)));
}
