const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const {exec} = require("child_process");

const paths = require('../../config/plugin/paths');

const manifest = require('../../src/plugin/manifest.json');
const pkg = require('../../package.json');

async function build() {
    console.log(chalk.grey.italic('Build plugin'));
    
    // Copy manifest.json + add version number form manifest
    manifest.version = pkg.version;
    manifest.author = pkg.author;
    manifest.authorEmail = pkg.authorEmail;
    manifest.name = pkg.name;
    manifest.description = pkg.description;
    fs.outputJson(paths.src + '/manifest.json', manifest, {spaces:4});
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
        exec('node_modules/.bin/skpm-build', options, (err, stdout, stderr) => {
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

module.exports = build;
