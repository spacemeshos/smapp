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
    width: 1330,
    height: 770,
    minWidth: 1330,
    minHeight: 770,
    center: true,
    webPreferences: {
      // TODO: https://www.electronjs.org/docs/latest/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
      nodeIntegration: true,
      // TODO: https://www.electronjs.org/docs/latest/tutorial/security#3-enable-context-isolation-for-remote-content
      contextIsolation: false,
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
