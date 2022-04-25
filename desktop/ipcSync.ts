import { BrowserWindow } from 'electron';
import { debounce } from 'throttle-debounce';

const id = (a) => a;

const IpcSyncMain = (channel: string, getBV: () => BrowserWindow | undefined, transform: (a) => any = id) => {
  const ipcChannel = 'IPC_SYNC_STORE';

  const send = debounce(50, (newState) => {
    const bv = getBV();
    if (bv) {
      bv.webContents.send(ipcChannel, transform(newState), channel);
    } else {
      console.log('ipc sync retry'); // eslint-disable-line no-console
      send(newState);
    }
  });
  return send;
};

export default IpcSyncMain;
