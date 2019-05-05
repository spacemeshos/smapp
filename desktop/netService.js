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

  _getLocalNodeSetupProgress = () =>
    new Promise((resolve, reject) => {
      this.service.GetInitProgress({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getTotalEarnings = () =>
    new Promise((resolve, reject) => {
      this.service.GetTotalAwards({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getUpcomingEarnings = () =>
    new Promise((resolve, reject) => {
      this.service.GetUpcomingAwards({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _setCommitmentSize = ({ commitmentSize }) =>
    new Promise((resolve, reject) => {
      this.service.SetCommitmentSize({ commitmentSize }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _setLogicalDrive = ({ logicalDrive }) =>
    new Promise((resolve, reject) => {
      this.service.SetLogicalDrive({ logicalDrive }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _setAwardsAddress = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.SetAwardsAddress({ address }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _checkNetworkConnection = () =>
    new Promise((resolve, reject) => {
      this.service.Echo({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  getBalance = async ({ event, address }) => {
    try {
      const { value } = await this._getBalance({ address });
      event.sender.send(ipcConsts.GET_BALANCE_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_BALANCE_FAILURE, error.message);
    }
  };

  sendTx = async ({ event, srcAddress, dstAddress, amount }) => {
    try {
      const { value } = await this._getNonce({ address: srcAddress });
      const resp = await this._submitTransaction({ srcAddress, dstAddress, amount: `${amount}`, nonce: value });
      event.sender.send(ipcConsts.GET_BALANCE_SUCCESS, resp.value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_BALANCE_FAILURE, error.message);
    }
  };

  getLocalNodeSetupProgress = async ({ event }) => {
    try {
      const { value } = await this._getLocalNodeSetupProgress();
      event.sender.send(ipcConsts.GET_INIT_PROGRESS_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_INIT_PROGRESS_FAILURE, error.message);
    }
  };

  getTotalEarnings = async ({ event }) => {
    try {
      const { value } = await this._getTotalEarnings();
      event.sender.send(ipcConsts.GET_TOTAL_EARNINGS_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_TOTAL_EARNINGS_FAILURE, error.message);
    }
  };

  getUpcomingEarnings = async ({ event }) => {
    try {
      const { value } = await this._getUpcomingEarnings();
      event.sender.send(ipcConsts.GET_UPCOMING_EARNINGS_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_UPCOMING_EARNINGS_FAILURE, error.message);
    }
  };

  setCommitmentSize = async ({ event, commitmentSize }) => {
    try {
      const { value } = await this._setCommitmentSize({ mbCommitted: commitmentSize });
      event.sender.send(ipcConsts.SET_COMMITMENT_SIZE_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.SET_COMMITMENT_SIZE_FAILURE, error.message);
    }
  };

  setLogicalDrive = async ({ event, logicalDrive }) => {
    try {
      const { value } = await this._setLogicalDrive({ logicalDrive });
      event.sender.send(ipcConsts.SET_LOGICAL_DRIVE_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.SET_LOGICAL_DRIVE_FAILURE, error.message);
    }
  };

  setAwardsAddress = async ({ event, awardsAddress }) => {
    try {
      const { value } = await this._setAwardsAddress({ awardsAddress });
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_FAILURE, error.message);
    }
  };

  checkNetworkConnection = async ({ event }) => {
    try {
      const { value } = await this._checkNetworkConnection();
      event.sender.send(ipcConsts.CHECK_NETWORK_CONNECTION_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.CHECK_NETWORK_CONNECTION_FAILURE, error.message);
    }
  };
}

export default new NetService();
