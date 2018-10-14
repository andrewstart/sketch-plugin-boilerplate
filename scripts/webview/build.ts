import fs = require('fs-extra');
import chalk from 'chalk';

import rollup = require('rollup');
import paths from '../../config/webview/paths';
import * as config from '../../config/webview/rollup';

export default async function build() {
    console.log(chalk.grey.italic('Build web views'));
    
    const input = config.input;
    const output = config.output;
    for (let i = 0; i < input.length; ++i) {
        // create a bundle
        const bundle = await rollup.rollup(input[i]);
        
        // or write the bundle to disk
        await bundle.write(output[i]);
        
        // Done :)
        console.log(chalk.green.bold(`  ✓ Web view "${paths.entry[i]}" compiled successfully`));
    }
    
    await fs.copy(paths.assetSrc, paths.assetDest);
    console.log('  ✓ Copied assets...');
    
    // new line
    console.log();
}
