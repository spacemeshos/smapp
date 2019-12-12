import path from 'path';
import { ipcConsts, nodeConsts } from '../app/vars';

const protoLoader = require('@grpc/proto-loader');

const grpc = require('grpc');

const PROTO_PATH = path.join(__dirname, '..', 'proto/api.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const spacemeshProto = grpc.loadPackageDefinition(packageDefinition);

class NetService {
  constructor(url = nodeConsts.DEFAULT_URL) {
    this.service = new spacemeshProto.pb.SpacemeshService(url, grpc.credentials.createInsecure());
  }

  _checkNetworkConnection = () =>
    new Promise((resolve, reject) => {
      this.service.Echo({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getMiningStatus = () =>
    new Promise((resolve, reject) => {
      this.service.GetMiningStats({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _initMining = ({ logicalDrive, commitmentSize, coinbase }) =>
    new Promise((resolve, reject) => {
      this.service.StartMining({ logicalDrive, commitmentSize, coinbase }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getGenesisTime = () =>
    new Promise((resolve, reject) => {
      this.service.GetGenesisTime({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getUpcomingAwards = () =>
    new Promise((resolve, reject) => {
      this.service.GetUpcomingAwards({}, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getAccountRewards = ({ address }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountRewards({ address }, (error, response) => {
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

  _getAccountTxs = ({ account, startLayer }) =>
    new Promise((resolve, reject) => {
      this.service.GetAccountTxs({ account, startLayer }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  _getTransaction = ({ id }) =>
    new Promise((resolve, reject) => {
      this.service.GetTransaction({ id }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });

  checkNetworkConnection = async ({ event }) => {
    try {
      const { value } = await this._checkNetworkConnection();
      event.sender.send(ipcConsts.CHECK_NODE_CONNECTION_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.CHECK_NODE_CONNECTION_FAILURE, error.message);
    }
  };

  getMiningStatus = async ({ event }) => {
    try {
      const { status } = await this._getMiningStatus();
      event.sender.send(ipcConsts.GET_MINING_STATUS_SUCCESS, status);
    } catch (error) {
      event.sender.send(ipcConsts.GET_MINING_STATUS_FAILURE, error.message);
    }
  };

  initMining = async ({ event, logicalDrive, commitmentSize, coinbase }) => {
    try {
      const { value } = await this._initMining({ logicalDrive, commitmentSize, coinbase });
      event.sender.send(ipcConsts.INIT_MINING_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.INIT_MINING_FAILURE, error.message);
    }
  };

  getGenesisTime = async ({ event }) => {
    try {
      const { value } = await this._getGenesisTime();
      event.sender.send(ipcConsts.GET_GENESIS_TIME_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.GET_GENESIS_TIME_FAILURE, error.message);
    }
  };

  getUpcomingRewards = async ({ event }) => {
    try {
      const { layers } = await this._getUpcomingAwards();
      const layersArr = layers.map((layer) => parseInt(layer));
      layersArr.sort((a, b) => a - b);
      event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_SUCCESS, layersArr);
    } catch (error) {
      event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_FAILURE, error.message);
    }
  };

  getAccountRewards = async ({ event, address }) => {
    try {
      const { rewards } = await this._getAccountRewards({ address });
      if (!rewards) {
        event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_SUCCESS, []);
      } else {
        const parsedReward = rewards.map((reward) => ({
          layer: parseInt(reward.layer),
          totalReward: parseInt(reward.totalReward),
          layerRewardEstimate: parseInt(reward.layerRewardEstimate)
        }));
        parsedReward.sort((rewardA, rewardB) => rewardA.layer - rewardB.layer);
        event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_SUCCESS, parsedReward);
      }
    } catch (error) {
      event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_FAILURE, error.message);
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

  setRewardsAddress = async ({ event, address }) => {
    try {
      const { value } = await this._setAwardsAddress({ address });
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_SUCCESS, value);
    } catch (error) {
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_FAILURE, error.message);
    }
  };

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
      const { id } = await this._submitTransaction({ tx });
      event.sender.send(ipcConsts.SEND_TX_SUCCESS, id);
    } catch (error) {
      event.sender.send(ipcConsts.SEND_TX_FAILURE, error.message);
    }
  };

  getAccountTxs = async ({ event, startLayer, account }) => {
    try {
      const { txs, validatedLayer } = await this._getAccountTxs({ startLayer, account });
      event.sender.send(ipcConsts.GET_TX_LIST_SUCCESS, { txs, validatedLayer });
    } catch (error) {
      event.sender.send(ipcConsts.GET_TX_LIST_FAILURE, error.message);
    }
  };

  getTransaction = async ({ event, id }) => {
    try {
      const tx = await this._getTransaction({ id });
      event.sender.send(ipcConsts.GET_TX_SUCCESS, tx);
    } catch (error) {
      event.sender.send(ipcConsts.GET_TX_FAILURE, error);
    }
  };
}

export default new NetService();
