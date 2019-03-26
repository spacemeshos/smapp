import { ipcConsts } from '../app/vars';

const PROTO_PATH = './proto/api.proto';
const grpc = require('grpc');

const spacemeshProto = grpc.load(PROTO_PATH); // eslint-disable-line prefer-destructuring

const DEFAULT_URL = 'localhost:9091';
const { SpacemeshService } = spacemeshProto.pb;

// netService.echo({ value: 'Hello World!' }, (error, response) => {
//   if (error) {
//     console.log('request failed'); // eslint-disable-line no-console
//   } else {
//     console.log(response); // eslint-disable-line no-console
//   }
// });

class NetService {
  constructor() {
    this.service = new SpacemeshService(DEFAULT_URL, grpc.credentials.createInsecure());
  }

  _getNonce = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetNonce({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getBalance = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetBalance({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _submitTransaction = ({ srcAddress, dstAddress, amount, nonce }) =>
    new Promise((resolve, reject) => {
      this.service.SubmitTransaction({ srcAddress, dstAddress, amount, nonce }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getBalance = async ({ event, address }) => {
    try {
      const resp = await this._getBalance({ address });
      event.sender.send(ipcConsts.GET_BALANCE_SUCCESS, resp);
    } catch (error) {
      event.sender.send(ipcConsts.GET_BALANCE_FAILURE, error.message);
    }
  };

  sendTx = async ({ event, srcAddress, dstAddress, amount }) => {
    try {
      const nonce = this._getNonce({ address: srcAddress });
      const resp = await this.service._submitTransaction({ srcAddress, dstAddress, amount, nonce });
      event.sender.send(ipcConsts.GET_BALANCE_SUCCESS, resp);
    } catch (error) {
      event.sender.send(ipcConsts.GET_BALANCE_FAILURE, error.message);
    }
  };
}

export default new NetService();
