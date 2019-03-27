// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class HttpService {
  static getBalance({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_BALANCE, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_BALANCE_SUCCESS, (response) => {
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_BALANCE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static sendTx({ srcAddress, dstAddress, amount }: { srcAddress: string, dstAddress: string, amount: number }) {
    ipcRenderer.send(ipcConsts.SEND_TX, { srcAddress, dstAddress, amount });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SEND_TX_SUCCESS, () => {});
      ipcRenderer.once(ipcConsts.SEND_TX_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }
}

export default HttpService;
