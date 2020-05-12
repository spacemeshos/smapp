// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class EventsService {
  static _createEvent = ({ event, data }: { event: string, data?: Object }) => {
    ipcRenderer.send(event, { data });
  };

  static _createEventWithResponse = ({ event, responseEvent, data }: { event: string, responseEvent: string, data?: Object }) => {
    ipcRenderer.removeAllListeners(responseEvent);
    ipcRenderer.send(event, { data });
    return new Promise<Object, Error>((resolve: Function) => {
      ipcRenderer.once(responseEvent, (event, response) => {
        resolve(response);
      });
    });
  };

  static createWallet = ({ timestamp, dataToEncrypt, password }: { timestamp: string, dataToEncrypt: Object, password: string }) =>
    EventsService._createEventWithResponse({
      event: ipcConsts.CREATE_WALLET_FILE,
      responseEvent: ipcConsts.CREATE_WALLET_FILE_RESPONSE,
      data: { timestamp, dataToEncrypt, password }
    });

  static readWalletFiles = () => EventsService._createEventWithResponse({ event: ipcConsts.READ_WALLET_FILES, responseEvent: ipcConsts.READ_WALLET_FILES_RESPONSE });

  static unlockWallet = ({ path, password }: { path: string, password: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.UNLOCK_WALLET_FILE, responseEvent: ipcConsts.UNLOCK_WALLET_FILE_RESPONSE, data: { path, password } });

  static updateWallet = ({ fileName, password, data }: { fileName: string, password: string, data: Object }) =>
    EventsService._createEvent({ event: ipcConsts.UPDATE_WALLET_FILE, data: { fileName, password, data } });

  static copyFile = ({ filePath, copyToDocuments }: { filePath: string, copyToDocuments?: boolean }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.COPY_FILE, responseEvent: ipcConsts.COPY_FILE_RESPONSE, data: { filePath, copyToDocuments } });

  static showFileInFolder = ({ isBackupFile, isLogFile }: { isBackupFile?: boolean, isLogFile?: boolean }) =>
    EventsService._createEvent({ event: ipcConsts.SHOW_FILE_IN_FOLDER, data: { isBackupFile, isLogFile } });

  static deleteWalletFile = ({ fileName }: { fileName: string }) => {
    EventsService._createEvent({ event: ipcConsts.DELETE_FILE, data: { fileName } });
  };

  static wipeOut = () => EventsService._createEvent({ event: ipcConsts.WIPE_OUT });

  /** ************************************   NODE   ****************************************** */

  static startNode = () => EventsService._createEvent({ event: ipcConsts.START_NODE });

  static stopNode = () => EventsService._createEvent({ event: ipcConsts.STOP_NODE });

  static getNodeStatus = () => EventsService._createEventWithResponse({ event: ipcConsts.GET_NODE_STATUS, responseEvent: ipcConsts.GET_NODE_STATUS_RESPONSE });

  static getNodeSettings = () => EventsService._createEventWithResponse({ event: ipcConsts.GET_NODE_SETTINGS, responseEvent: ipcConsts.GET_NODE_SETTINGS_RESPONSE });

  static setPort = ({ port }: { port: string }) => EventsService._createEvent({ event: ipcConsts.SET_NODE_PORT, data: { port } });

  static selectPostFolder = () => EventsService._createEventWithResponse({ event: ipcConsts.SELECT_POST_FOLDER, responseEvent: ipcConsts.SELECT_POST_FOLDER_RESPONSE });

  static initMining = ({ logicalDrive, commitmentSize, coinbase }: { logicalDrive: string, commitmentSize: number, coinbase: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.INIT_MINING, responseEvent: ipcConsts.INIT_MINING_RESPONSE, data: { logicalDrive, commitmentSize, coinbase } });

  static getMiningStatus = () => EventsService._createEventWithResponse({ event: ipcConsts.GET_MINING_STATUS, responseEvent: ipcConsts.GET_MINING_STATUS_RESPONSE });

  static getUpcomingRewards = () => EventsService._createEventWithResponse({ event: ipcConsts.GET_UPCOMING_REWARDS, responseEvent: ipcConsts.GET_UPCOMING_REWARDS_RESPONSE });

  static getAccountRewards = ({ address, accountIndex }: { address: string, accountIndex: number }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.GET_ACCOUNT_REWARDS, responseEvent: ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, data: { address, accountIndex } });

  static setRewardsAddress = ({ address }: { address: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.SET_REWARDS_ADDRESS, responseEvent: ipcConsts.SET_AWARDS_ADDRESS_RESPONSE, data: { address } });

  static setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.SET_NODE_IP, responseEvent: ipcConsts.SET_NODE_IP_RESPONSE, data: { nodeIpAddress } });

  /** **********************************   TRANSACTIONS   ************************************** */

  static getBalance = ({ address }: { address: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.GET_BALANCE, responseEvent: ipcConsts.GET_BALANCE_RESPONSE, data: { address } });

  static getNonce = ({ address }: { address: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.GET_NONCE, responseEvent: ipcConsts.GET_NONCE_RESPONSE, data: { address } });

  static sendTx = ({ tx, accountIndex, txToAdd }: { tx: Uint8Array, accountIndex: number, txToAdd: Object }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.SEND_TX, responseEvent: ipcConsts.SEND_TX_RESPONSE, data: { tx, accountIndex, txToAdd } });

  static updateTransaction = ({ newData, accountIndex, txId }: { newData: string, accountIndex: number, txId?: string }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.UPDATE_TX, responseEvent: ipcConsts.UPDATE_TX_RESPONSE, data: { newData, accountIndex, txId } });

  static getAccountTxs = ({ accountIndex }: { accountIndex: number }) =>
    EventsService._createEventWithResponse({ event: ipcConsts.GET_ACCOUNT_TXS, responseEvent: ipcConsts.GET_ACCOUNT_TXS_RESPONSE, data: { accountIndex } });

  /** ************************************   AUTOSTART   ************************************** */

  static isAutoStartEnabled = () =>
    EventsService._createEventWithResponse({ event: ipcConsts.IS_AUTO_START_ENABLED_REQUEST, responseEvent: ipcConsts.IS_AUTO_START_ENABLED_REQUEST_RESPONSE });

  static toggleAutoStart = () => EventsService._createEvent({ event: ipcConsts.TOGGLE_AUTO_START });

  /** **************************************   MISC   ***************************************** */

  static getAudioPath = () => EventsService._createEventWithResponse({ event: ipcConsts.GET_AUDIO_PATH, responseEvent: ipcConsts.GET_AUDIO_PATH_RESPONSE });

  static hardRefresh = () => EventsService._createEvent({ event: ipcConsts.HARD_REFRESH });

  static print = ({ content }: { content: string }) => EventsService._createEvent({ event: ipcConsts.PRINT, data: { content } });
}

export default EventsService;
