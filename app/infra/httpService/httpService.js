// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class HttpService {
  /**
   *  ************************************************** NODE MANAGEMENT ********************************************************
   */
  static startMining({ commitmentSize }: { commitmentSize: number }) {
    ipcRenderer.send(ipcConsts.START_MINING, { commitmentSize });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.START_MINING_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.START_MINING_SUCCESS, ipcConsts.START_MINING_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.START_MINING_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.START_MINING_SUCCESS, ipcConsts.START_MINING_FAILURE] });
        reject(args);
      });
    });
  }

  static getTotalAwards() {
    ipcRenderer.send(ipcConsts.GET_TOTAL_AWARDS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_TOTAL_EARNINGS_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_TOTAL_EARNINGS_SUCCESS, ipcConsts.GET_TOTAL_EARNINGS_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_TOTAL_EARNINGS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_TOTAL_EARNINGS_SUCCESS, ipcConsts.GET_TOTAL_EARNINGS_FAILURE] });
        reject(args);
      });
    });
  }

  static getUpcomingAward() {
    ipcRenderer.send(ipcConsts.GET_UPCOMING_AWARD);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_UPCOMING_EARNINGS_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_UPCOMING_EARNINGS_SUCCESS, ipcConsts.GET_UPCOMING_EARNINGS_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_UPCOMING_EARNINGS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_UPCOMING_EARNINGS_SUCCESS, ipcConsts.GET_UPCOMING_EARNINGS_FAILURE] });
        reject(args);
      });
    });
  }

  static setAwardsAddress({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.SET_AWARDS_ADDRESS, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_AWARDS_ADDRESS_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_AWARDS_ADDRESS_SUCCESS, ipcConsts.SET_AWARDS_ADDRESS_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.SET_AWARDS_ADDRESS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_AWARDS_ADDRESS_SUCCESS, ipcConsts.SET_AWARDS_ADDRESS_FAILURE] });
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
