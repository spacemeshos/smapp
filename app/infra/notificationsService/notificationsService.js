// @flow
import path from 'path';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class NotificationsService {
  static notify = async ({ title, notification, callback }: { title: string, notification: string, callback: () => void }) => {
    const isPermitted = await Notification.requestPermission();
    if (isPermitted) {
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
}

export default NotificationsService;
