// @flow
import path from 'path';
import { eventsService } from '/infra/eventsService';

class NotificationsService {
  static notify = async ({ title, notification, callback }: { title: string, notification: string, callback: () => void }) => {
    const isPermitted = await Notification.requestPermission();
    const isAppVisible = await eventsService.checkAppVisibility();
    if (isPermitted && !isAppVisible) {
      const notificationOptions: any = {
        body: notification,
        icon: path.join(__dirname, '..', 'resources', 'icon.png')
      };
      const desktopNotification = new Notification(title || 'Alert', notificationOptions);
      desktopNotification.onclick = () => {
        eventsService.notificationWasClicked();
        callback && callback();
      };
    }
  };
}

export default NotificationsService;
