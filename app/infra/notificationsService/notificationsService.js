import path from 'path';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

// @flow
class NotificationsService {
  static notify = ({ title, notification, callback }: { title: string, notification: string, callback: () => void }) => {
    NotificationsService.isNotificationPermitted().then(({ isNotificationAllowed }: { isNotificationAllowed: boolean }) => {
      if (isNotificationAllowed) {
        const notificationOptions: any = {
          body: notification,
          icon: path.join(__dirname, '..', 'app', 'assets', 'icons', 'app_icon.png')
        };
        const desktopNotification = new Notification(title || 'Alert', notificationOptions);
        desktopNotification.onclick = () => {
          ipcRenderer.send(ipcConsts.NOTIFICATION_CLICK);
          callback && callback();
        };
      }
    });
  };

  static isNotificationPermitted = async () => {
    const isPermitted = await Notification.requestPermission();
    ipcRenderer.send(ipcConsts.CAN_NOTIFY);
    return new Promise((resolve, reject) => {
      ipcRenderer.once(ipcConsts.CAN_NOTIFY_SUCCESS, (event, isInFocus) => {
        resolve({ isNotificationAllowed: isPermitted && !isInFocus });
      });
      ipcRenderer.once(ipcConsts.CAN_NOTIFY_FAILURE, (event, args) => {
        reject(args);
      });
    });
  };
}

export default NotificationsService;
