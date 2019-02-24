// @flow
import { ipcRenderer } from 'electron';
import uuid4 from 'uuid4';
import { ipcConsts } from '../../vars';

class HttpService {
  static sendRequest({ url, params }: { url: string, params?: Object }) {
    const uuid = uuid4();
    ipcRenderer.send(ipcConsts.SEND_REQUEST, { url, params, uuid });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(`ipcConsts.REQUEST_RESPONSE_SUCCESS-${uuid}`, () => {});
      ipcRenderer.once(`ipcConsts.REQUEST_RESPONSE_FAILURE-${uuid}`, (event, args) => {
        reject(args);
      });
    });
  }
}

export default HttpService;
