// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class PrintService {
  static print({ content }: { content: string }) {
    ipcRenderer.send(ipcConsts.PRINT, { content });
  }
}

export default PrintService;
