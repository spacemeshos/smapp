import { BrowserWindow } from 'electron';
import { debounce } from 'throttle-debounce';
import { delay } from '../shared/utils';

const id = (a) => a;

const IpcSyncMain = <A, B = unknown>(
  channel: string,
  getBV: () => BrowserWindow | undefined,
  transform: (a: A) => B = id
) => {
  const ipcChannel = 'IPC_SYNC_STORE';

  const send = debounce(50, async (newState) => {
    const bv = getBV();
    if (bv) {
      bv.webContents.send(ipcChannel, transform(newState), channel);
      return true;
    } else {
      console.log('ipc sync retry'); // eslint-disable-line no-console
      await delay(500);
      return send(newState);
    }
  });
  return send;
};

export default IpcSyncMain;
