import { BrowserWindow } from 'electron';

const id = (a) => a;

const IpcSyncMain = (channel: string, getBV: () => BrowserWindow | undefined, transform: (a) => any = id) => {
  const ipcChannel = 'IPC_SYNC_STORE';
  let timeout;

  const send = (newState) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const bv = getBV();
      if (bv) {
        bv.webContents.send(ipcChannel, transform(newState), channel);
      } else {
        console.log('ipc sync retry'); // eslint-disable-line no-console
        send(newState);
      }
    }, 50);
  };

  return send;
};

export default IpcSyncMain;
