import path = require('path');
import fs = require('fs-extra');

const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

export default {
  src: resolveApp('src/webview/'),
  tsconfig: resolveApp('src/webview/tsconfig.json'),
  build: resolveApp('Resources/webview/'),
  entry: ['index'],
  assetSrc: resolveApp('src/webview/assets/'),
  assetDest: resolveApp('Resources/webview/assets'),
};
