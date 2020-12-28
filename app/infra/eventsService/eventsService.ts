import { ipcRenderer } from 'electron';
import { ipcConsts } from '../../vars';
import { Tx } from '../../types';

class EventsService {
  static createWallet = ({ password, existingMnemonic }: { password: string; existingMnemonic: string }) =>
    ipcRenderer.invoke(ipcConsts.CREATE_WALLET_FILE, { password, existingMnemonic });

  static readWalletFiles = () => ipcRenderer.invoke(ipcConsts.READ_WALLET_FILES);

  static getOsThemeColor = () => ipcRenderer.invoke(ipcConsts.GET_OS_THEME_COLOR);

  static openBrowserView = () => ipcRenderer.send(ipcConsts.OPEN_BROWSER_VIEW);

  static openExternalLink = ({ link }: { link: string }) => ipcRenderer.send(ipcConsts.OPEN_EXTERNAL_LINK, { link });

  static openExplorerLink = ({ uri }: { uri: string }) => ipcRenderer.send(ipcConsts.OPEN_EXPLORER_LINK, { uri });

  static updateBrowserViewTheme = ({ isDarkMode }: { isDarkMode: boolean }) => ipcRenderer.send(ipcConsts.SEND_THEME_COLOR, { isDarkMode });

  static destroyBrowserView = () => ipcRenderer.send(ipcConsts.DESTROY_BROWSER_VIEW);

  static unlockWallet = ({ path, password }: { path: string; password: string }) => ipcRenderer.invoke(ipcConsts.UNLOCK_WALLET_FILE, { path, password });

  static updateWalletFile = ({ fileName, password, data }: { fileName: string; password?: string; data: any }) =>
    ipcRenderer.send(ipcConsts.UPDATE_WALLET_FILE, { fileName, password, data });

  static createNewAccount = ({ fileName, password }: { fileName: string; password: string }) => ipcRenderer.invoke(ipcConsts.CREATE_NEW_ACCOUNT, { fileName, password });

  static copyFile = ({ filePath, copyToDocuments }: { filePath: string; copyToDocuments?: boolean }) => ipcRenderer.invoke(ipcConsts.COPY_FILE, { filePath, copyToDocuments });

  static showFileInFolder = ({ isBackupFile, isLogFile }: { isBackupFile?: boolean; isLogFile?: boolean }) =>
    ipcRenderer.send(ipcConsts.SHOW_FILE_IN_FOLDER, { isBackupFile, isLogFile });

  static deleteWalletFile = ({ fileName }: { fileName: string }) => ipcRenderer.send(ipcConsts.DELETE_FILE, { fileName });

  static wipeOut = () => ipcRenderer.send(ipcConsts.WIPE_OUT);

  /** ************************************   NODE   ****************************************** */

  static startNode = () => ipcRenderer.send(ipcConsts.START_NODE);

  static getNodeStatus = () => ipcRenderer.invoke(ipcConsts.GET_NODE_STATUS);

  static getNodeSettings = () => ipcRenderer.invoke(ipcConsts.GET_NODE_SETTINGS);

  static setPort = ({ port }: { port: string }) => ipcRenderer.send(ipcConsts.SET_NODE_PORT, { port });

  static selectPostFolder = () => ipcRenderer.invoke(ipcConsts.SELECT_POST_FOLDER);

  static initMining = ({
    logicalDrive,
    commitment,
    coinbase,
    processor,
    isPausedOnUsage
  }: {
    logicalDrive: string;
    commitment: number;
    coinbase: string;
    processor: any;
    isPausedOnUsage: boolean;
  }) => ipcRenderer.invoke(ipcConsts.INIT_MINING, { logicalDrive, commitment, coinbase, processor, isPausedOnUsage });

  static getMiningStatus = () => ipcRenderer.invoke(ipcConsts.GET_MINING_STATUS);

  static getAccountRewards = ({ address, accountIndex }: { address: string; accountIndex: number }) => ipcRenderer.invoke(ipcConsts.GET_ACCOUNT_REWARDS, { address, accountIndex });

  static setRewardsAddress = ({ address }: { address: string }) => ipcRenderer.invoke(ipcConsts.SET_REWARDS_ADDRESS, { address });

  static setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }) => ipcRenderer.invoke(ipcConsts.SET_NODE_IP, { nodeIpAddress });

  /** **********************************   TRANSACTIONS   ************************************** */

  static getBalance = ({ address }: { address: string }) => ipcRenderer.invoke(ipcConsts.GET_BALANCE, { address });

  static sendTx = ({ fullTx, accountIndex }: { fullTx: Tx; accountIndex: number }) => ipcRenderer.invoke(ipcConsts.SEND_TX, { fullTx, accountIndex });

  static updateTransaction = ({ newData, accountIndex, txId }: { newData: any; accountIndex: number; txId?: string }) =>
    ipcRenderer.invoke(ipcConsts.UPDATE_TX, { newData, accountIndex, txId });

  static getAccountTxs = () => ipcRenderer.invoke(ipcConsts.GET_ACCOUNT_TXS);

  /** ************************************   AUTOSTART   ************************************** */

  static isAutoStartEnabled = () => ipcRenderer.invoke(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);

  static toggleAutoStart = () => ipcRenderer.send(ipcConsts.TOGGLE_AUTO_START);

  /** **************************************   MISC   ***************************************** */

  static reloadApp = () => ipcRenderer.send(ipcConsts.RELOAD_APP);

  static print = ({ content }: { content: string }) => ipcRenderer.send(ipcConsts.PRINT, { content });

  static signMessage = ({ message, accountIndex }: { message: string; accountIndex: number }) => ipcRenderer.invoke(ipcConsts.SIGN_MESSAGE, { message, accountIndex });

  static isServiceReady = () => ipcRenderer.invoke(ipcConsts.IS_SERVICE_READY);

  /** ************************************** CLOSING APP ************************************** */

  static closeApp = (cb) => ipcRenderer.on(ipcConsts.CLOSING_APP, cb);

  static removeAllListeners = () => ipcRenderer.removeAllListeners(ipcConsts.CLOSING_APP);
}

export default EventsService;
