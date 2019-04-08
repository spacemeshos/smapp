// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class PrintService {
  static print({ content }: { content: string }) {
    ipcRenderer.send(ipcConsts.PRINT, { content });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.PRINT_SUCCESS, (response) => {
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.PRINT_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }
}

export default PrintService;
