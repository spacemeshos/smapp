// @flow
import { eventsService } from '/infra/eventsService';
import { icon } from '/assets/images';

class NotificationsService {
  static notify = async ({ title, notification, callback, tag }: { title: string, notification: string, callback: () => void, tag?: number }) => {
    const permission = await Notification.requestPermission();
    const isAppVisible = await eventsService.checkAppVisibility();
    if (permission === 'granted' && !isAppVisible) {
      const notificationOptions = {
        body: notification,
        icon,
        tag: `message-group-${tag || 0}`
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
