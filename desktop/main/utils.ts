import path from 'path';
import readFromBottom from 'fs-reverse';
import { Notification } from 'electron';
import { AppContext } from './context';
import { USERDATA_DIR } from './constants';

export const showMainWindow = (context: AppContext) => {
  const { mainWindow } = context;
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
};

export const showNotification = (
  context: AppContext,
  { title, body }: { title: string; body: string }
) => {
  if (Notification.isSupported() && !context.mainWindow?.isMaximized()) {
    const options = { title, body, icon: '../app/assets/images/icon.png' };
    const notification = new Notification(options);
    notification.show();
    notification.once('click', () => showMainWindow(context));
  }
};

export const getNodeLogsPath = (netId?: number) =>
  path.resolve(USERDATA_DIR, `spacemesh-log-${netId || 0}.txt`);

//

export const readLinesFromBottom = (filepath: string, amount: number) =>
  new Promise<string[]>((resolve) => {
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
  });
