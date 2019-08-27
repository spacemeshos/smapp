// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class HttpService {
  /**
   *  ************************************************** NODE MANAGEMENT ********************************************************
   */
  static initMining({ logicalDrive, commitmentSize, address }: { logicalDrive: string, commitmentSize: number, address: string }) {
    ipcRenderer.send(ipcConsts.INIT_MINING, { logicalDrive, commitmentSize, address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.INIT_MINING_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.INIT_MINING_SUCCESS, ipcConsts.INIT_MINING_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.INIT_MINING_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.INIT_MINING_SUCCESS, ipcConsts.INIT_MINING_FAILURE] });
        reject(args);
      });
    });
  }

  static getMiningStatus() {
    ipcRenderer.send(ipcConsts.GET_MINING_STATUS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_MINING_STATUS_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_MINING_STATUS_SUCCESS, ipcConsts.GET_MINING_STATUS_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_MINING_STATUS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_MINING_STATUS_SUCCESS, ipcConsts.GET_MINING_STATUS_FAILURE] });
        reject(args);
      });
    });
  }

  static getGenesisTime() {
    ipcRenderer.send(ipcConsts.GET_GENESIS_TIME);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_GENESIS_TIME_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_GENESIS_TIME_SUCCESS, ipcConsts.GET_GENESIS_TIME_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_GENESIS_TIME_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_GENESIS_TIME_SUCCESS, ipcConsts.GET_GENESIS_TIME_FAILURE] });
        reject(args);
      });
    });
  }

  static getUpcomingRewards() {
    ipcRenderer.send(ipcConsts.GET_UPCOMING_REWARDS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_UPCOMING_REWARDS_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_UPCOMING_REWARDS_SUCCESS, ipcConsts.GET_UPCOMING_REWARDS_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_UPCOMING_REWARDS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_UPCOMING_REWARDS_SUCCESS, ipcConsts.GET_UPCOMING_REWARDS_FAILURE] });
        reject(args);
      });
    });
  }

  static setRewardsAddress({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.SET_REWARDS_ADDRESS, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_REWARDS_ADDRESS_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_REWARDS_ADDRESS_SUCCESS, ipcConsts.SET_REWARDS_ADDRESS_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.SET_REWARDS_ADDRESS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_REWARDS_ADDRESS_SUCCESS, ipcConsts.SET_REWARDS_ADDRESS_FAILURE] });
        reject(args);
      });
    });
  }

  static checkNodeConnection() {
    ipcRenderer.send(ipcConsts.CHECK_NODE_CONNECTION);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.CHECK_NODE_CONNECTION_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.CHECK_NODE_CONNECTION_SUCCESS, ipcConsts.CHECK_NODE_CONNECTION_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.CHECK_NODE_CONNECTION_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.CHECK_NODE_CONNECTION_SUCCESS, ipcConsts.CHECK_NODE_CONNECTION_FAILURE] });
        reject(args);
      });
    });
  }

  static setNodeIpAddress({ nodeIpAddress }: { nodeIpAddress: string }) {
    ipcRenderer.send(ipcConsts.SET_NODE_IP, { nodeIpAddress });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_NODE_IP_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_NODE_IP_SUCCESS, ipcConsts.SET_NODE_IP_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.SET_NODE_IP_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_NODE_IP_SUCCESS, ipcConsts.SET_NODE_IP_FAILURE] });
        reject(args);
      });
    });
  }

  /**
   *  ************************************************** TRANSACTIONS ********************************************************
   */
  static getBalance({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_BALANCE, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_BALANCE_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_BALANCE_SUCCESS, ipcConsts.GET_BALANCE_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_BALANCE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_BALANCE_SUCCESS, ipcConsts.GET_BALANCE_FAILURE] });
        reject(args);
      });
    });
  }

  static getNonce({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_NONCE, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_NONCE_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_NONCE_SUCCESS, ipcConsts.GET_NONCE_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_NONCE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_NONCE_SUCCESS, ipcConsts.GET_NONCE_FAILURE] });
        reject(args);
      });
    });
  }

  static sendTx({ tx }: { tx: Buffer }) {
    ipcRenderer.send(ipcConsts.SEND_TX, { tx });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SEND_TX_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SEND_TX_SUCCESS, ipcConsts.SEND_TX_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.SEND_TX_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SEND_TX_SUCCESS, ipcConsts.SEND_TX_FAILURE] });
        reject(args);
      });
    });
  }
}

export default HttpService;
