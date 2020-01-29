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

  _checkNodeConnection = () =>
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
      this.service.GetAccountTxs({ account: { address: account }, startLayer }, (error, response) => {
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

  checkNodeConnection = async ({ event }) => {
    try {
      await this._checkNodeConnection();
      event.sender.send(ipcConsts.CHECK_NODE_CONNECTION_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.CHECK_NODE_CONNECTION_RESPONSE, { error: error.message });
    }
  };

  getMiningStatus = async ({ event }) => {
    try {
      const { status } = await this._getMiningStatus();
      event.sender.send(ipcConsts.GET_MINING_STATUS_RESPONSE, { error: null, status });
    } catch (error) {
      event.sender.send(ipcConsts.GET_MINING_STATUS_RESPONSE, { error, status: null });
    }
  };

  initMining = async ({ event, logicalDrive, commitmentSize, coinbase }) => {
    try {
      await this._initMining({ logicalDrive, commitmentSize, coinbase });
      event.sender.send(ipcConsts.INIT_MINING_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.INIT_MINING_RESPONSE, { error });
    }
  };

  getGenesisTime = async ({ event }) => {
    try {
      const { value } = await this._getGenesisTime();
      event.sender.send(ipcConsts.GET_GENESIS_TIME_RESPONSE, { error: null, time: value });
    } catch (error) {
      event.sender.send(ipcConsts.GET_GENESIS_TIME_RESPONSE, { error, time: null });
    }
  };

  getUpcomingRewards = async ({ event }) => {
    try {
      const { layers } = await this._getUpcomingAwards();
      if (!layers) {
        event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, { error: null, layers: [] });
      }
      const resolvedLayers = layers || [];
      const parsedLayers = resolvedLayers.map((layer) => parseInt(layer));
      parsedLayers.sort((a, b) => a - b);
      event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, { error: null, layers: parsedLayers });
    } catch (error) {
      event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, { error: error.message, layers: null });
    }
  };

  getAccountRewards = async ({ event, address }) => {
    try {
      const { rewards } = await this._getAccountRewards({ address });
      if (!rewards) {
        event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, { error: null, rewards: [] });
      } else {
        const parsedReward = rewards.map((reward) => ({
          layer: parseInt(reward.layer),
          totalReward: parseInt(reward.totalReward),
          layerRewardEstimate: parseInt(reward.layerRewardEstimate),
          timestamp: new Date().getTime()
        }));
        parsedReward.sort((rewardA, rewardB) => rewardA.layer - rewardB.layer);
        event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, { error: null, rewards: parsedReward });
      }
    } catch (error) {
      event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, { error, rewards: [] });
    }
  };

  setNodeIpAddress = ({ event, nodeIpAddress }) => {
    try {
      this.service = new spacemeshProto.pb.SpacemeshService(nodeIpAddress, grpc.credentials.createInsecure());
      event.sender.send(ipcConsts.SET_NODE_IP_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.SET_NODE_IP_RESPONSE, { error });
    }
  };

  setRewardsAddress = async ({ event, address }) => {
    try {
      await this._setAwardsAddress({ address });
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_RESPONSE, { error });
    }
  };

  getBalance = async ({ event, address }) => {
    try {
      const { value } = await this._getBalance({ address });
      event.sender.send(ipcConsts.GET_BALANCE_RESPONSE, { error: null, balance: value });
    } catch (error) {
      event.sender.send(ipcConsts.GET_BALANCE_RESPONSE, { error, balance: null });
    }
  };

  getNonce = async ({ event, address }) => {
    try {
      const { value } = await this._getNonce({ address });
      event.sender.send(ipcConsts.GET_NONCE_RESPONSE, { error: null, nonce: value });
    } catch (error) {
      event.sender.send(ipcConsts.GET_NONCE_RESPONSE, { error, nonce: null });
    }
  };

  sendTx = async ({ event, tx }) => {
    try {
      const { id } = await this._submitTransaction({ tx });
      event.sender.send(ipcConsts.SEND_TX_RESPONSE, { error: null, id });
    } catch (error) {
      event.sender.send(ipcConsts.SEND_TX_RESPONSE, error.message);
    }
  };

  getAccountTxs = async ({ event, startLayer, account }) => {
    try {
      const { txs, validatedLayer } = await this._getAccountTxs({ startLayer, account });
      event.sender.send(ipcConsts.GET_ACCOUNT_TXS_RESPONSE, { error: null, txs: txs || [], validatedLayer: parseInt(validatedLayer) });
    } catch (error) {
      event.sender.send(ipcConsts.GET_ACCOUNT_TXS_RESPONSE, { error: error.message, txs: null, validatedLayer: null });
    }
  };

  getTransaction = async ({ event, id }) => {
    try {
      const tx = await this._getTransaction({ id });
      const { txId, sender, receiver, amount, fee, status, layerId, timestamp } = tx;
      const parsedTx = {
        txId: txId.id.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
        sender: sender.address,
        receiver: receiver.address,
        amount: parseInt(amount),
        fee: parseInt(fee),
        status,
        layerId: parseInt(layerId),
        timestamp: parseInt(timestamp) * 1000
      };
      event.sender.send(ipcConsts.GET_TX_RESPONSE, { error: null, tx: parsedTx });
    } catch (error) {
      event.sender.send(ipcConsts.GET_TX_RESPONSE, { error, tx: null });
    }
  };
}

export default new NetService();
