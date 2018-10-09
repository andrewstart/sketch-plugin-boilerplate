var path = require('path');
var fs = require('fs-extra');
const pkg = require('../../package.json');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var src = resolveApp('src/plugin');
var frameworks = resolveApp('src/frameworks');

module.exports = {
  src,
  entry: resolveApp('src/plugin/index.js'),
  manifest: resolveApp('src/plugin/manifest.json'),
  build: resolveApp('Contents/Sketch'),
  bundleSrc: resolveApp('Contents'),
  bundle: resolveApp(pkg.skpm.main),
  frameworks,
  frameworksBuild: resolveApp('Contents/Resources/frameworks'),
  watch: [src, frameworks]
};
