import path from 'path';
import { ipcConsts } from '../app/vars';

const protoLoader = require('@grpc/proto-loader');

const grpc = require('grpc');

const PROTO_PATH = path.join(__dirname, '..', 'proto/api.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const spacemeshProto = grpc.loadPackageDefinition(packageDefinition);

// const DEFAULT_URL = '192.168.30.233:9091';
const DEFAULT_URL = 'localhost:9091';

class NetService {
  constructor(url = DEFAULT_URL) {
    this.service = new spacemeshProto.pb.SpacemeshService(url, grpc.credentials.createInsecure());
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

  _submitTransaction = ({ tx }) =>
    new Promise((resolve, reject) => {
      this.service.SubmitTransaction({ tx }, (error, response) => {
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

  getNonce = async ({ event, address }) => {
    try {
      const { value } = await this._getNonce({ address });
      event.sender.send(ipcConsts.GET_NONCE_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_NONCE_FAILURE, error.message);
    }
  };

  sendTx = async ({ event, tx }) => {
    try {
      const { value } = await this._submitTransaction({ tx });
      event.sender.send(ipcConsts.SEND_TX_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.SEND_TX_FAILURE, error.message);
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

  setNodeIpAddress = ({ event, nodeIpAddress }) => {
    try {
      this.service = new spacemeshProto.pb.SpacemeshService(nodeIpAddress, grpc.credentials.createInsecure());
      event.sender.send(ipcConsts.SET_NODE_IP_SUCCESS, nodeIpAddress);
    } catch (error) {
      event.sender.send(ipcConsts.SET_NODE_IP_FAILURE, error.message);
    }
  };
}

export default new NetService();
