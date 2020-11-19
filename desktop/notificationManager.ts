import { BrowserWindow, Notification } from 'electron';
// import { icon } from ;

class NotificationManager {
  mainWindow: BrowserWindow;

  constructor(window: BrowserWindow) {
    this.mainWindow = window;
  }

  showNotification = ({ title, body }: { title: string; body: string }) => {
    if (Notification.isSupported() && this.mainWindow.isMinimized()) {
      const options = { title, body, icon: '../app/assets/images/icon.png' };
      const notification = new Notification(options);
      notification.show();
      notification.once('click', () => {
        this.mainWindow.show();
        this.mainWindow.focus();
      });
    }
  };
}

export default NotificationManager;
