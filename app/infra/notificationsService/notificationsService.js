// @flow
import path from 'path';
import { listenerCleanup } from '/infra/utils';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class NotificationsService {
  static notify = async ({ title, notification, callback }: { title: string, notification: string, callback: () => void }) => {
    const isPermitted = await Notification.requestPermission();
    const isAppVisible = await NotificationsService.checkAppVisibility();
    if (isPermitted && !isAppVisible) {
      const notificationOptions: any = {
        body: notification,
        icon: path.join(__dirname, '..', 'resources', 'icon.png')
      };
      const desktopNotification = new Notification(title || 'Alert', notificationOptions);
      desktopNotification.onclick = () => {
        ipcRenderer.send(ipcConsts.NOTIFICATION_CLICK);
        callback && callback();
      };
    }
  };

  static checkAppVisibility() {
    ipcRenderer.send(ipcConsts.CHECK_APP_VISIBLITY);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.APP_VISIBLE, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.APP_VISIBLE, ipcConsts.APP_HIDDEN] });
        resolve(true);
      });
      ipcRenderer.once(ipcConsts.APP_HIDDEN, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.APP_VISIBLE, ipcConsts.APP_HIDDEN] });
        resolve(false);
      });
    });
  }
}

export default NotificationsService;
