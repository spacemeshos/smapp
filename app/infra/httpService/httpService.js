// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class HttpService {
  /**
   *  ************************************************** NODE MANAGEMENT ********************************************************
   */

  static getNodeStatus() {
    ipcRenderer.send(ipcConsts.GET_NODE_STATUS);
    ipcRenderer.removeAllListeners(ipcConsts.GET_NODE_STATUS_RESPONSE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_NODE_STATUS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.status);
      });
    });
  }

  static initMining({ logicalDrive, commitmentSize, coinbase }: { logicalDrive: string, commitmentSize: number, coinbase: string }) {
    ipcRenderer.send(ipcConsts.INIT_MINING, { logicalDrive, commitmentSize, coinbase });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.INIT_MINING_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  }

  static getMiningStatus() {
    ipcRenderer.send(ipcConsts.GET_MINING_STATUS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_MINING_STATUS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.status);
      });
    });
  }

  static getGenesisTime() {
    ipcRenderer.send(ipcConsts.GET_GENESIS_TIME);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_GENESIS_TIME_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.time);
      });
    });
  }

  static getUpcomingRewards() {
    ipcRenderer.send(ipcConsts.GET_UPCOMING_REWARDS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.layers);
      });
    });
  }

  static getAccountRewards({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_ACCOUNT_REWARDS, { address });
    ipcRenderer.removeAllListeners(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.rewards);
      });
    });
  }

  static setRewardsAddress({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.SET_REWARDS_ADDRESS, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_AWARDS_ADDRESS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  }

  static setNodeIpAddress({ nodeIpAddress }: { nodeIpAddress: string }) {
    ipcRenderer.send(ipcConsts.SET_NODE_IP, { nodeIpAddress });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_NODE_IP_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  }

  /**
   *  ************************************************** TRANSACTIONS ********************************************************
   */
  static getBalance({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_BALANCE, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_BALANCE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.balance);
      });
    });
  }

  static getNonce({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_NONCE, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_NONCE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.nonce);
      });
    });
  }

  static sendTx({ tx }: { tx: Buffer }) {
    ipcRenderer.send(ipcConsts.SEND_TX, { tx });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SEND_TX_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.id);
      });
    });
  }

  static getAccountTxs({ startLayer, account }: { startLayer: number, account: string }) {
    ipcRenderer.send(ipcConsts.GET_ACCOUNT_TXS, { startLayer, account });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_ACCOUNT_TXS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve({ txs: response.txs, validatedLayer: response.validatedLayer });
      });
    });
  }

  static getTransaction({ id }: { id: Uint8Array }) {
    ipcRenderer.send(ipcConsts.GET_TX, { id });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_TX_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.tx);
      });
    });
  }
}

export default HttpService;
