var path = require('path');
var fs = require('fs-extra');

var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

module.exports = {
  src: resolveApp('src/webview/'),
  tsconfig: resolveApp('src/webview/tsconfig.json'),
  build: resolveApp('Resources/webview/'),
  entry: ['index'],
  assetSrc: resolveApp('src/webview/assets/'),
  assetDest: resolveApp('Resources/webview/assets'),
};