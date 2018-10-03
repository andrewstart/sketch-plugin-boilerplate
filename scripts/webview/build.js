const fs = require('fs-extra');
const chalk = require('chalk');

const rollup = require('rollup');
const paths = require('../../config/webview/paths');
const config = require('../../config/webview/rollup');

async function build() {
    console.log(chalk.grey.italic('Build web views'));
    
    await fs.emptyDir(paths.build);
    console.log('  ✓ Removed old build...');
    
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

module.exports = build;
