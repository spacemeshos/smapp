import path from 'path';
import readFromBottom from 'fs-reverse';
import { BrowserWindow, Notification } from 'electron';
import { isFileExists } from '../utils';
import { USERDATA_DIR } from './constants';

export const showMainWindow = (mainWindow: BrowserWindow) => {
  mainWindow.show();
  mainWindow.focus();
};

export const showNotification = (
  mainWindow: BrowserWindow,
  { title, body }: { title: string; body: string }
) => {
  if (Notification.isSupported() && !mainWindow?.isMaximized()) {
    const options = { title, body, icon: '../app/assets/images/icon.png' };
    const notification = new Notification(options);
    notification.show();
    notification.once('click', () => showMainWindow(mainWindow));
  }
};

export const getNodeLogsPath = (genesisID?: string) =>
  path.resolve(USERDATA_DIR, `spacemesh-log-${genesisID || ''}.txt`);

//

export const readLinesFromBottom = async (filepath: string, amount: number) => {
  if (!(await isFileExists(filepath))) return [];

  return new Promise<string[]>((resolve) => {
    const str = readFromBottom(filepath);
    const result: string[] = [];
    let count = 0;
    str.on('data', (line) => {
      if (count >= amount) {
        str.pause();
        str.destroy();
        resolve(result);
        return;
      }
      result.push(line);
      count += 1;
    });

    str.on('end', () => {
      resolve(result);
    });
  });
};
