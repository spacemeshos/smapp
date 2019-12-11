// @flow
import path from 'path';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

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
    ipcRenderer.send(ipcConsts.CHECK_APP_VISIBILITY);
    return new Promise<string, Error>((resolve: Function) => {
      ipcRenderer.once(ipcConsts.IS_APP_VISIBLE, (event, xml) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.IS_APP_VISIBLE] });
        resolve(xml);
      });
    });
  }
}

export default NotificationsService;
