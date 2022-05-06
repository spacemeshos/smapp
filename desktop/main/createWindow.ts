import path from 'path';
import { BrowserWindow, shell } from 'electron';
import MenuBuilder from '../menu';
import { isDev } from '../utils';

export default async () => {
  const pagePath = `file://${path.resolve(
    __dirname,
    isDev() ? '..' : ''
  )}/index.html`;
  const mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 700,
    minWidth: 1100,
    minHeight: 680,
    center: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Load page after initialization complete
  mainWindow.loadURL(
    `file://${path.resolve(__dirname, isDev() ? '..' : '')}/index.html`
  );
  mainWindow.loadURL(pagePath);

  /**
   * fallback for page fail
   * @see https://github.com/maximegris/angular-electron/issues/15
   */
  mainWindow.webContents.on('did-fail-load', () =>
    mainWindow.loadURL(pagePath)
  );

  return mainWindow;
};
