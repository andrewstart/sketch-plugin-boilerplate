import fs = require('fs-extra');
import chalk from 'chalk';
import child_process = require('child_process');

import paths from '../../config/plugin/paths';

import manifest = require('../../src/plugin/manifest.json');
import pkg = require('../../package.json');

export default async function build() {
    console.log(chalk.grey.italic('Build plugin'));
    
    // Copy manifest.json + add version number form manifest
    manifest.version = pkg.version;
    manifest.author = pkg.author;
    (manifest as any).authorEmail = (pkg as any).authorEmail;
    manifest.name = pkg.name;
    manifest.description = pkg.description;
    await fs.outputJson(paths.src + '/manifest.json', manifest, {spaces:4});
    console.log('  ✓ Copy manifest (version ' + pkg.version + ')');
    
    // Copy framework(s)
    if (fs.existsSync(paths.frameworks)) {
        const list = await fs.readdir(paths.frameworks);
        const frameworks = list.filter(item => item.endsWith('.framework'));
        if (frameworks.length) {
            console.log('  ✓ Copy frameworks');
            await fs.emptyDir(paths.frameworksBuild);
            for (const item of frameworks) {
                await fs.copy(paths.frameworks + '/' + item, paths.frameworksBuild + '/' + item);
            }
        }
    }
    
    await new Promise((resolve, reject) => {
        const options = {
            cwd: process.cwd()
        };
        child_process.exec('node_modules/.bin/skpm-build', options, (err, stdout, stderr) => {
            if (err) {
                console.error(stderr);
                return reject(stderr || stdout);
            }
            console.log(stdout);
            resolve(stdout);
        });
    });
    
    // Done :)
    console.log(chalk.green.bold('  ✓ Plugin compiled successfully'));
    console.log();
}

export async function copyPluginAssets() {
    console.log(chalk.grey.italic('Copy plugin assets'));
    
    // copy additional assets
    if (await fs.pathExists(paths.assetsSrc)) {
        await fs.copy(paths.assetsSrc, paths.assets);
        console.log('  ✓ Copy source assets');
    }
}
