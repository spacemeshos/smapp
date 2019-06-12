// @flow
import path from 'path';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class NotificationsService {
  static notify = ({ title, notification, callback }: { title: string, notification: string, callback: () => void }) => {
    NotificationsService.getNotificationAllowedStatus().then(({ isNotificationAllowed }: { isNotificationAllowed: boolean }) => {
      if (isNotificationAllowed) {
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
    });
  };

  static getNotificationAllowedStatus = async () => {
    const isPermitted = await Notification.requestPermission();
    ipcRenderer.send(ipcConsts.CAN_NOTIFY);
    return new Promise((resolve) => {
      ipcRenderer.once(ipcConsts.CAN_NOTIFY_SUCCESS, (event, isInFocus) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.CAN_NOTIFY_SUCCESS] });
        resolve({ isNotificationAllowed: isPermitted && !isInFocus });
      });
    });
  };
}

export default NotificationsService;
