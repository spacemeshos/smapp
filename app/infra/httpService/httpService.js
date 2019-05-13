// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class HttpService {
  static getBalance({ address }: { address: string }) {
    ipcRenderer.send(ipcConsts.GET_BALANCE, { address });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_BALANCE_SUCCESS, (response) => {
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_BALANCE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static sendTx({ srcAddress, dstAddress, amount }: { srcAddress: string, dstAddress: string, amount: number }) {
    ipcRenderer.send(ipcConsts.SEND_TX, { srcAddress, dstAddress, amount });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SEND_TX_SUCCESS, () => {});
      ipcRenderer.once(ipcConsts.SEND_TX_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static getLocalNodeSetupProgress() {
    ipcRenderer.send(ipcConsts.GET_INIT_PROGRESS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_INIT_PROGRESS_SUCCESS, (event, response) => {
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_INIT_PROGRESS_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static getTotalEarnings() {
    ipcRenderer.send(ipcConsts.GET_TOTAL_EARNINGS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_TOTAL_EARNINGS_SUCCESS, (event, response) => {
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_TOTAL_EARNINGS_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static getUpcomingEarnings() {
    ipcRenderer.send(ipcConsts.GET_UPCOMING_EARNINGS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_UPCOMING_EARNINGS_SUCCESS, (event, response) => {
        resolve(response);
      });
      ipcRenderer.once(ipcConsts.GET_UPCOMING_EARNINGS_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static setCommitmentSize({ commitmentSize }: { commitmentSize: number }) {
    ipcRenderer.send(ipcConsts.SET_COMMITMENT_SIZE, { commitmentSize });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_COMMITMENT_SIZE_SUCCESS, () => resolve());
      ipcRenderer.once(ipcConsts.SET_COMMITMENT_SIZE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static setLogicalDrive({ logicalDrive }: { logicalDrive: string }) {
    ipcRenderer.send(ipcConsts.SET_LOGICAL_DRIVE, { logicalDrive });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_LOGICAL_DRIVE_SUCCESS, () => resolve());
      ipcRenderer.once(ipcConsts.SET_LOGICAL_DRIVE_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static setAwardsAddress({ awardsAddress }: { awardsAddress: string }) {
    ipcRenderer.send(ipcConsts.SET_AWARDS_ADDRESS, { awardsAddress });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_AWARDS_ADDRESS_SUCCESS, () => resolve());
      ipcRenderer.once(ipcConsts.SET_AWARDS_ADDRESS_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static checkNetworkConnection() {
    ipcRenderer.send(ipcConsts.CHECK_NETWORK_CONNECTION);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.CHECK_NETWORK_CONNECTION_SUCCESS, () => resolve());
      ipcRenderer.once(ipcConsts.CHECK_NETWORK_CONNECTION_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }

  static setNodeIpAddress({ nodeIpAddress }: { nodeIpAddress: string }) {
    ipcRenderer.send(ipcConsts.SET_NODE_IP, { nodeIpAddress });
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.SET_NODE_IP_SUCCESS, () => resolve());
      ipcRenderer.once(ipcConsts.SET_NODE_IP_FAILURE, (event, args) => {
        reject(args);
      });
    });
  }
}

export default HttpService;
