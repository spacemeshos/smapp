import { ipcRenderer } from 'electron';
import { ipcConsts } from '../../vars';
import { Tx } from '../../types';
import { setNodeError, setNodeStatus, setVersionAndBuild } from '../../redux/node/actions';
import { updateAccountData, setTransactions } from '../../redux/wallet/actions';
import { SET_SMESHER_SETTINGS_AND_STARTUP_STATUS, SET_POST_DATA_CREATION_STATUS, SET_ACCOUNT_REWARDS } from '../../redux/smesher/actions';
import store from '../../redux/store';
import { NodeError, NodeStatus, NodeVersionAndBuild, PostSetupOpts } from '../../../shared/types';
import { showClosingAppModal } from '../../redux/ui/actions';

class EventsService {
  static createWallet = ({ password, existingMnemonic, ip, port }: { password: string; existingMnemonic: string; ip?: string; port?: string }) =>
    ipcRenderer.invoke(ipcConsts.W_M_CREATE_WALLET, { password, existingMnemonic, ip, port });

  static readWalletFiles = () => ipcRenderer.invoke(ipcConsts.W_M_READ_WALLET_FILES);

  static getOsThemeColor = () => ipcRenderer.invoke(ipcConsts.GET_OS_THEME_COLOR);

  static openBrowserView = () => ipcRenderer.send(ipcConsts.OPEN_BROWSER_VIEW);

  static updateBrowserViewTheme = ({ isDarkMode }: { isDarkMode: boolean }) => ipcRenderer.send(ipcConsts.SEND_THEME_COLOR, { isDarkMode });

  static destroyBrowserView = () => ipcRenderer.send(ipcConsts.DESTROY_BROWSER_VIEW);

  static unlockWallet = ({ path, password }: { path: string; password: string }) => ipcRenderer.invoke(ipcConsts.W_M_UNLOCK_WALLET, { path, password });

  static updateWalletFile = ({ fileName, password, data }: { fileName: string; password?: string; data: any }) =>
    ipcRenderer.send(ipcConsts.W_M_UPDATE_WALLET, { fileName, password, data });

  static createNewAccount = ({ fileName, password }: { fileName: string; password: string }) => ipcRenderer.invoke(ipcConsts.W_M_CREATE_NEW_ACCOUNT, { fileName, password });

  static copyFile = ({ filePath, copyToDocuments }: { filePath: string; copyToDocuments?: boolean }) => ipcRenderer.invoke(ipcConsts.W_M_COPY_FILE, { filePath, copyToDocuments });

  static showFileInFolder = ({ isBackupFile, isLogFile }: { isBackupFile?: boolean; isLogFile?: boolean }) =>
    ipcRenderer.send(ipcConsts.W_M_SHOW_FILE_IN_FOLDER, { isBackupFile, isLogFile });

  static deleteWalletFile = ({ fileName }: { fileName: string }) => ipcRenderer.send(ipcConsts.W_M_SHOW_DELETE_FILE, { fileName });

  static wipeOut = () => ipcRenderer.send(ipcConsts.W_M_WIPE_OUT);

  /** ************************************   SMESHER   ****************************************** */
  static selectPostFolder = () => ipcRenderer.invoke(ipcConsts.SMESHER_SELECT_POST_FOLDER);

  static checkFreeSpace = ({ dataDir }: { dataDir: string }) => ipcRenderer.invoke(ipcConsts.SMESHER_CHECK_FREE_SPACE, { dataDir });

  static getEstimatedRewards = () => ipcRenderer.invoke(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS);

  static startSmeshing = (postSetupOpts: PostSetupOpts) => ipcRenderer.invoke(ipcConsts.SMESHER_START_SMESHING, { postSetupOpts });

  static stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) => ipcRenderer.invoke(ipcConsts.SMESHER_STOP_SMESHING, { deleteFiles });

  /** **********************************   TRANSACTIONS   ************************************** */

  static sendTx = ({ fullTx, accountIndex }: { fullTx: Tx; accountIndex: number }) => ipcRenderer.invoke(ipcConsts.W_M_SEND_TX, { fullTx, accountIndex });

  static updateTransaction = ({ newData, accountIndex, txId }: { newData: any; accountIndex: number; txId?: string }) =>
    ipcRenderer.invoke(ipcConsts.W_M_UPDATE_TX, { newData, accountIndex, txId });

  /** ************************************   AUTOSTART   ************************************** */

  static isAutoStartEnabled = () => ipcRenderer.invoke(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);

  static toggleAutoStart = () => ipcRenderer.send(ipcConsts.TOGGLE_AUTO_START);

  /** **************************************   MISC   ***************************************** */

  static reloadApp = () => ipcRenderer.send(ipcConsts.RELOAD_APP);

  static print = ({ content }: { content: string }) => ipcRenderer.send(ipcConsts.PRINT, { content });

  static signMessage = ({ message, accountIndex }: { message: string; accountIndex: number }) => ipcRenderer.invoke(ipcConsts.W_M_SIGN_MESSAGE, { message, accountIndex });

  /** **************************************  WALLET MANAGER  **************************************** */

  static activateWalletManager = ({ ip, port }: { ip: string | undefined; port: string | undefined }) => ipcRenderer.invoke(ipcConsts.W_M_ACTIVATE, { ip, port });

  static getNetworkDefinitions = () => ipcRenderer.invoke(ipcConsts.W_M_GET_NETWORK_DEFINITIONS);

  static getCurrentLayer = () => ipcRenderer.invoke(ipcConsts.W_M_GET_CURRENT_LAYER);

  static getGlobalStateHash = () => ipcRenderer.invoke(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);

  /** **************************************  NODE MANAGER  **************************************** */

  static restartNode = () => ipcRenderer.invoke(ipcConsts.N_M_RESTART_NODE);

  static requestVersionAndBuild = () => ipcRenderer.send(ipcConsts.N_M_GET_VERSION_AND_BUILD);

  static setPort = ({ port }: { port: string }) => ipcRenderer.send(ipcConsts.SET_NODE_PORT, { port });
}

ipcRenderer.on(ipcConsts.N_M_SET_NODE_STATUS, (_event, status: NodeStatus) => {
  store.dispatch(setNodeStatus(status));
});
ipcRenderer.on(ipcConsts.N_M_SET_NODE_ERROR, (_event, error: NodeError) => {
  store.dispatch(setNodeError(error));
});

ipcRenderer.on(ipcConsts.N_M_GET_VERSION_AND_BUILD, (_event, payload: NodeVersionAndBuild) => {
  store.dispatch(setVersionAndBuild(payload));
});

ipcRenderer.on(ipcConsts.T_M_UPDATE_ACCOUNT, (_event, request) => {
  store.dispatch(updateAccountData({ account: request.data.account, accountId: request.data.accountId }));
});

ipcRenderer.on(ipcConsts.T_M_UPDATE_TXS, (_event, request) => {
  store.dispatch(setTransactions({ txs: request.data.txs, publicKey: request.data.publicKey }));
});

ipcRenderer.on(ipcConsts.T_M_UPDATE_REWARDS, (_event, request) => {
  const { rewards, publicKey } = request.data;
  store.dispatch({ type: SET_ACCOUNT_REWARDS, payload: { rewards, publicKey } });
});

ipcRenderer.on(ipcConsts.SMESHER_SET_SETTINGS_AND_STARTUP_STATUS, (_event, request) => {
  const { config, coinbase, dataDir, smesherId, postSetupState, numLabelsWritten, errorMessage, isSmeshing } = request;
  store.dispatch({
    type: SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
    payload: { config, coinbase, dataDir, smesherId, postSetupState, numLabelsWritten, errorMessage, isSmeshing }
  });
});

ipcRenderer.on(ipcConsts.SMESHER_SEND_SMESHING_CONFIG, (_event, request) => {
  const { smeshingConfig } = request;
  store.dispatch({ type: SET_SMESHER_SETTINGS_AND_STARTUP_STATUS, payload: { smeshingConfig } });
});

ipcRenderer.on(ipcConsts.SMESHER_SET_SETUP_COMPUTE_PROVIDERS, (_event, request) => {
  const { config, coinbase, dataDir, smesherId, postSetupState, numLabelsWritten, errorMessage, isSmeshing } = request;
  store.dispatch({
    type: SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
    payload: { config, coinbase, dataDir, smesherId, postSetupState, numLabelsWritten, errorMessage, isSmeshing }
  });
});

ipcRenderer.on(ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS, (_event, request) => {
  const {
    error,
    status: { postSetupState, numLabelsWritten, errorMessage }
  } = request;
  store.dispatch({ type: SET_POST_DATA_CREATION_STATUS, payload: { error, postSetupState, numLabelsWritten, errorMessage } });
});

ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
  store.dispatch(showClosingAppModal());
});

export default EventsService;
