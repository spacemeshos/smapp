import { BrowserWindow } from 'electron';

const UNSUB_NOOP_FN = () => {};

abstract class AbstractManager {
  protected mainWindow: BrowserWindow;

  protected abstract subscribeIPCEvents?(): () => void;

  private _unsubscribeIPC = UNSUB_NOOP_FN;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.setBrowserWindow(mainWindow, true);
  }

  public isIPCSubscribed() {
    return this._unsubscribeIPC !== UNSUB_NOOP_FN;
  }

  public unsubscribeIPC() {
    if (this.isIPCSubscribed()) {
      this._unsubscribeIPC();
      this._unsubscribeIPC = UNSUB_NOOP_FN;
    }
  }

  public subscribeIPC() {
    if (this.isIPCSubscribed()) {
      this._unsubscribeIPC();
    }
    this._unsubscribeIPC =
      typeof this.subscribeIPCEvents === 'function'
        ? this.subscribeIPCEvents()
        : UNSUB_NOOP_FN;
  }

  // Updates MainWindow reference and resubscribes to IPC Events
  public setBrowserWindow(mainWindow: BrowserWindow, force = false) {
    if (this.mainWindow === mainWindow && !force) return;
    this.unsubscribeIPC();
    this.mainWindow = mainWindow;
    this._unsubscribeIPC =
      typeof this.subscribeIPCEvents === 'function'
        ? this.subscribeIPCEvents()
        : UNSUB_NOOP_FN;
  }
}

export default AbstractManager;
