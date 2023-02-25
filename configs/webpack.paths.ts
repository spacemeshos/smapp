const path = require('path');

const rootPath = path.join(__dirname, '..');

const dllPath = path.join(__dirname, '../dll');

const srcMainPath = path.join(rootPath, 'desktop');
const srcRendererPath = path.join(rootPath, 'app');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app'); // app in release
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(rootPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');

const buildPath = path.join(releasePath, 'build'); // build in release

export default {
  rootPath,
  dllPath,
  srcMainPath,
  srcRendererPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  buildPath,
};
