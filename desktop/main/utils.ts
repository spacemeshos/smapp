import { Notification } from 'electron';
import { AppContext } from './context';

export const showMainWindow = (context: AppContext) => {
  const { mainWindow } = context;
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.focus();
};

export const showNotification = (context: AppContext, { title, body }: { title: string; body: string }) => {
  if (Notification.isSupported() && !context.mainWindow?.isMaximized()) {
    const options = { title, body, icon: '../app/assets/images/icon.png' };
    const notification = new Notification(options);
    notification.show();
    notification.once('click', () => showMainWindow(context));
  }
};
