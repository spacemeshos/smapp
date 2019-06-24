// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class HttpService {
  static getBalance({ address }: { address: Uint8Array }) {
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

  static getNonce({ address }: { address: Uint8Array }) {
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

  static getLatestValidLayerId() {
    ipcRenderer.send(ipcConsts.GET_LATEST_VALID_LAYER_ID);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_LATEST_VALID_LAYER_ID_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_LATEST_VALID_LAYER_ID_SUCCESS, ipcConsts.GET_LATEST_VALID_LAYER_ID_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.SEND_TX_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_LATEST_VALID_LAYER_ID_SUCCESS, ipcConsts.GET_LATEST_VALID_LAYER_ID_FAILURE] });
        reject(args);
      });
    });
  }

  static getTxList({ address, layerId }: { address: Uint8Array, layerId: number }) {
    ipcRenderer.send(ipcConsts.GET_TX_LIST, { address, layerId });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_TX_LIST_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_TX_LIST_SUCCESS, ipcConsts.GET_TX_LIST_FAILURE] });
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.SEND_TX_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_TX_LIST_SUCCESS, ipcConsts.GET_TX_LIST_FAILURE] });
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

  static getLocalNodeSetupProgress() {
    ipcRenderer.send(ipcConsts.GET_INIT_PROGRESS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_INIT_PROGRESS_SUCCESS, (event, response) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_INIT_PROGRESS_SUCCESS, ipcConsts.GET_INIT_PROGRESS_FAILURE] });
        const timer = setTimeout(() => {
          resolve(response);
          clearTimeout(timer);
        }, 10000);
      });
      ipcRenderer.once(ipcConsts.GET_INIT_PROGRESS_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.GET_INIT_PROGRESS_SUCCESS, ipcConsts.GET_INIT_PROGRESS_FAILURE] });
        reject(args);
      });
    });
  }

  static getTotalEarnings() {
    ipcRenderer.send(ipcConsts.GET_TOTAL_EARNINGS);
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

  static getUpcomingEarnings() {
    ipcRenderer.send(ipcConsts.GET_UPCOMING_EARNINGS);
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

  static setCommitmentSize({ commitmentSize }: { commitmentSize: number }) {
    ipcRenderer.send(ipcConsts.SET_COMMITMENT_SIZE, { commitmentSize });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_COMMITMENT_SIZE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_COMMITMENT_SIZE_SUCCESS, ipcConsts.SET_COMMITMENT_SIZE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.SET_COMMITMENT_SIZE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_COMMITMENT_SIZE_SUCCESS, ipcConsts.SET_COMMITMENT_SIZE_FAILURE] });
        reject(args);
      });
    });
  }

  static setLogicalDrive({ logicalDrive }: { logicalDrive: string }) {
    ipcRenderer.send(ipcConsts.SET_LOGICAL_DRIVE, { logicalDrive });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_LOGICAL_DRIVE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_LOGICAL_DRIVE_SUCCESS, ipcConsts.SET_LOGICAL_DRIVE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.SET_LOGICAL_DRIVE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.SET_LOGICAL_DRIVE_SUCCESS, ipcConsts.SET_LOGICAL_DRIVE_FAILURE] });
        reject(args);
      });
    });
  }

  static setAwardsAddress({ awardsAddress }: { awardsAddress: string }) {
    ipcRenderer.send(ipcConsts.SET_AWARDS_ADDRESS, { awardsAddress });
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

  static checkNetworkConnection() {
    ipcRenderer.send(ipcConsts.CHECK_NETWORK_CONNECTION);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.CHECK_NETWORK_CONNECTION_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.CHECK_NETWORK_CONNECTION_SUCCESS, ipcConsts.CHECK_NETWORK_CONNECTION_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.CHECK_NETWORK_CONNECTION_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.CHECK_NETWORK_CONNECTION_SUCCESS, ipcConsts.CHECK_NETWORK_CONNECTION_FAILURE] });
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
}

export default HttpService;
