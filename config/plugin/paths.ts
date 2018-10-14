import path = require('path');
import fs = require('fs-extra');
import pkg = require('../../package.json');

const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

export default {
  src: resolveApp('src/plugin'),
  entry: resolveApp('src/plugin/index.js'),
  manifest: resolveApp('src/plugin/manifest.json'),
  bundle: resolveApp(pkg.skpm.main),
  assetsSrc: resolveApp('src/assets'),
  assets: resolveApp('Resources'),
  frameworks: resolveApp('src/frameworks'),
  frameworksBuild: resolveApp('Resources/frameworks'),
};
