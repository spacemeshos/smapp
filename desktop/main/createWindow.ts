import path from 'path';
import { BrowserWindow, Event, shell } from 'electron';
import MenuBuilder from '../menu';
import { isDev } from '../utils';
import { AppContext } from './context';

export default async (
  context: AppContext,
  onCloseHandler: (e: Event) => void | Promise<void>
) => {
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

  mainWindow.on('close', onCloseHandler);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!context.mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (context.showWindowOnLoad) {
      mainWindow.show();
      mainWindow.focus();
    }
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

  context.mainWindow = mainWindow;
  return mainWindow;
};
