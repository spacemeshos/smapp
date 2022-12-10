import path from 'path';
import * as url from 'url';
import { app, BrowserWindow, shell } from 'electron';
import MenuBuilder from '../menu';
import { isDev, resolveHtmlPath } from '../utils';


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}


const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};
let mainWindow: BrowserWindow | null = null;
const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const pagePath = resolveHtmlPath('index.html')
  console.log({ pagePath });

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 700,
    minWidth: 1100,
    minHeight: 680,
    center: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../../.erb/dll/preload.js'),
    },
  });
  console.log(isDev());
  // if (isDev()) {
  // }

  mainWindow.loadURL(pagePath);


  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  /**
   * fallback for page fail
   * @see https://github.com/maximegris/angular-electron/issues/15
   */
  mainWindow.webContents.on('did-fail-load', () =>
    mainWindow?.loadURL(pagePath)
  );

  return mainWindow;
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

export default createWindow;
