import fs = require('fs-extra');
import chalk from 'chalk';
import child_process = require('child_process');
import path = require('path');

import paths from '../../config/plugin/paths';

import pkg = require('../../package.json');

export default async function build() {
    console.log(chalk.grey.italic('Build plugin'));
    
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
    
    const manifestPath = path.join(paths.bundle, 'Contents', 'Sketch', 'manifest.json');
    const manifest = await fs.readJson(manifestPath);
    const deployConfig = await fs.readJson(path.resolve('config', 'deploy.json'));
    // Copy manifest.json + add data from package/config
    manifest.version = pkg.version;
    manifest.author = pkg.author;
    (manifest as any).authorEmail = (pkg as any).authorEmail;
    manifest.name = pkg.skpm.name;
    manifest.description = pkg.description;
    manifest.appcast = deployConfig.apiUrl + deployConfig.appcastPath;
    await fs.outputJson(manifestPath, manifest, {spaces:4});
    console.log('  ✓ Copy manifest (version ' + pkg.version + ')');
    
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
