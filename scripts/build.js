if (process.argv.includes("--prod")) {
    process.env.NODE_ENV = 'production';
}

const fs = require('fs-extra');
const chalk = require('chalk');
const { logError } = require('./utils/build');

const buildPlugin = require('./plugin/build');
const buildWebView = require('./webview/build');
const paths = require('../config/plugin/paths');

console.log(chalk.bold('Create production build'));
console.log();

buildWebView()
.then(() => {
    return buildPlugin();
})
.then(() => {
    console.log(chalk.green.bold('✓ FINISHED BUILD '));
    console.log(chalk.green('You can find the plugin bundle in ' + chalk.italic(paths.bundle)));
})
.catch((err) => {
    logError(err);
});
