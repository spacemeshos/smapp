import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { isDev } from '../utils';

const DEFAULT_WIDTH = 370;
const DEFAULT_HEIGHT = 160;

function electronPrompt(options, parentWindow) {
  return new Promise((resolve, reject) => {
    const id = `${Date.now()}-${Math.random()}`;

    const opts = {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      minWidth: DEFAULT_WIDTH,
      minHeight: DEFAULT_HEIGHT,
      resizable: false,
      title: 'Prompt',
      label: 'Please input a value:',
      buttonLabels: null,
      alwaysOnTop: false,
      value: null,
      type: 'input',
      selectOptions: null,
      icon: null,
      useHtmlLabel: false,
      styles: null,
      menuBarVisible: false,
      skipTaskbar: true,
      ...options,
    };

    if (opts.type === 'select' && (opts.selectOptions === null || typeof opts.selectOptions !== 'object')) {
      reject(new Error('"selectOptions" must be an object'));
      return;
    }

    let promptWindow: BrowserWindow | null = new BrowserWindow({
      width: opts.width,
      height: opts.height,
      minWidth: opts.minWidth,
      minHeight: opts.minHeight,
      resizable: opts.resizable,
      minimizable: false,
      fullscreenable: false,
      maximizable: false,
      parent: parentWindow,
      skipTaskbar: opts.skipTaskbar,
      alwaysOnTop: opts.alwaysOnTop,
      useContentSize: opts.resizable,
      modal: Boolean(parentWindow),
      title: opts.title,
      icon: opts.icon || undefined,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: false,
      },
    });

    promptWindow.setMenu(null);
    promptWindow.setMenuBarVisibility(opts.menuBarVisible);

    const getOptionsListener = (event: any) => {
      event.returnValue = JSON.stringify(opts);
    };

    const cleanup = () => {
      ipcMain.removeAllListeners(`prompt-get-options:${id}`);
      ipcMain.removeAllListeners(`prompt-post-data:${id}`);
      ipcMain.removeAllListeners(`prompt-error:${id}`);

      if (promptWindow) {
        promptWindow.close();
        promptWindow = null;
      }
    };

    const postDataListener = (event, value) => {
      resolve(value);
      event.returnValue = null;
      cleanup();
    };

    const unresponsiveListener = () => {
      reject(new Error('Window was unresponsive'));
      cleanup();
    };

    const errorListener = (event, message) => {
      reject(new Error(message));
      event.returnValue = null;
      cleanup();
    };

    ipcMain.on(`prompt-get-options:${id}`, getOptionsListener);
    ipcMain.on(`prompt-post-data:${id}`, postDataListener);
    ipcMain.on(`prompt-error:${id}`, errorListener);
    promptWindow.on('unresponsive', unresponsiveListener);

    promptWindow.on('closed', () => {
      promptWindow = null;
      cleanup();
      resolve(null);
    });

    const filePath = path.resolve(app.getAppPath(), isDev() ? './prompt/static' : './prompt', 'prompt.html');
    process.stdout.write('Prompt: ');
    process.stdout.write(filePath);
    promptWindow.loadFile(filePath, { hash: id });
  });
}

export default electronPrompt;
