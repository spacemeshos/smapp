import { ipcConsts } from '/vars';

// @flow
class NotificationsManager {
  static showAppOnNotificationClick = async ({ browserWindow, event }: { browserWindow: any, event: any }) => {
    try {
      browserWindow.show();
      browserWindow.focus();
      event.sender.send(ipcConsts.NOTIFICATION_CLICK_SUCCESS);
    } catch (error) {
      event.sender.send(ipcConsts.NOTIFICATION_CLICK_FAILURE, error.message);
    }
  };

  static isAppInFocus = async ({ browserWindow, event }: { browserWindow: any, event: any }) => {
    try {
      const isInFocus = browserWindow.isFocused();
      event.sender.send(ipcConsts.CAN_NOTIFY_SUCCESS, isInFocus);
    } catch (error) {
      event.sender.send(ipcConsts.CAN_NOTIFY_FAILURE, error.message);
    }
  };
}

export default NotificationsManager;
