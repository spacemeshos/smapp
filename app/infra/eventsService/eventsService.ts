import { ipcRenderer } from 'electron';
import { ProgressInfo, UpdateInfo } from 'electron-updater';

import { ipcConsts } from '../../vars';
import {
  setNodeError,
  setNodeStatus,
  setVersionAndBuild,
} from '../../redux/node/actions';
import { setTransactions, updateAccountData } from '../../redux/wallet/actions';
import {
  SET_ACCOUNT_REWARDS,
  SET_POST_DATA_CREATION_STATUS,
  SET_SETUP_COMPUTE_PROVIDERS,
  SET_SMESHER_CONFIG,
  SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
} from '../../redux/smesher/actions';
import store from '../../redux/store';
import {
  HexString,
  IPCSmesherStartupData,
  NodeError,
  NodeStatus,
  NodeVersionAndBuild,
  PostSetupOpts,
  PostSetupState,
  PublicService,
  SocketAddress,
  TxSendRequest,
  WalletMeta,
  WalletSecrets,
  WalletType,
} from '../../../shared/types';
import { showClosingAppModal } from '../../redux/ui/actions';
// Temporary solution to provide types
// Could be replaced using something like `electron-ipcfy`
import { LOCAL_NODE_API_URL } from '../../../shared/constants';
import TransactionManager from '../../../desktop/TransactionManager';
import updaterSlice from '../../redux/updater/slice';
import {
  CurrentLayer,
  GlobalStateHash,
  NetworkDefinitions,
} from '../../types/events';

class EventsService {
  static createWallet = ({
    password,
    existingMnemonic,
    type,
    apiUrl,
    netId,
  }: {
    password: string;
    existingMnemonic: string;
    type: WalletType;
    apiUrl: SocketAddress | null;
    netId: number;
  }) =>
    ipcRenderer.invoke(ipcConsts.W_M_CREATE_WALLET, {
      password,
      existingMnemonic,
      type,
      apiUrl,
      netId,
    });

  static readWalletFiles = () =>
    ipcRenderer.invoke(ipcConsts.READ_WALLET_FILES);

  static getOsThemeColor = () =>
    ipcRenderer.invoke(ipcConsts.GET_OS_THEME_COLOR);

  static openBrowserView = () => ipcRenderer.send(ipcConsts.OPEN_BROWSER_VIEW);

  static updateBrowserViewTheme = ({ isDarkMode }: { isDarkMode: boolean }) =>
    ipcRenderer.send(ipcConsts.SEND_THEME_COLOR, { isDarkMode });

  static destroyBrowserView = () =>
    ipcRenderer.send(ipcConsts.DESTROY_BROWSER_VIEW);

  static listNetworks = (): Promise<
    { netId: number; netName: string; explorer: string }[]
  > => ipcRenderer.invoke(ipcConsts.LIST_NETWORKS);

  static listPublicServices = (): Promise<PublicService[]> =>
    ipcRenderer.invoke(ipcConsts.LIST_PUBLIC_SERVICES);

  static unlockWallet = ({
    path,
    password,
  }: {
    path: string;
    password: string;
  }) => ipcRenderer.invoke(ipcConsts.W_M_UNLOCK_WALLET, { path, password });

  static updateWalletMeta = <T extends keyof WalletMeta>(
    fileName: string,
    key: T,
    value: WalletMeta[T]
  ) =>
    ipcRenderer.send(ipcConsts.W_M_UPDATE_WALLET_META, {
      fileName,
      key,
      value,
    });

  static updateWalletSecrets = (
    fileName: string,
    password: string,
    data: WalletSecrets
  ) =>
    ipcRenderer.send(ipcConsts.W_M_UPDATE_WALLET_SECRETS, {
      fileName,
      password,
      data,
    });

  static createNewAccount = ({
    fileName,
    password,
  }: {
    fileName: string;
    password: string;
  }) =>
    ipcRenderer.invoke(ipcConsts.W_M_CREATE_NEW_ACCOUNT, {
      fileName,
      password,
    });

  static backupWallet = (filePath: string) =>
    ipcRenderer.invoke(ipcConsts.W_M_BACKUP_WALLET, filePath);

  static addWalletPath = (filePath: string) =>
    ipcRenderer.invoke(ipcConsts.W_M_ADD_WALLET_PATH, filePath);

  static showFileInFolder = ({
    filePath,
    isLogFile,
  }: {
    filePath?: string;
    isLogFile?: boolean;
  }) =>
    ipcRenderer.send(ipcConsts.W_M_SHOW_FILE_IN_FOLDER, {
      filePath,
      isLogFile,
    });

  static deleteWalletFile = (filepath: string) =>
    ipcRenderer.send(ipcConsts.W_M_SHOW_DELETE_FILE, filepath);

  static wipeOut = () => ipcRenderer.send(ipcConsts.W_M_WIPE_OUT);

  /** ************************************   SMESHER   ****************************************** */
  static selectPostFolder = () =>
    ipcRenderer.invoke(ipcConsts.SMESHER_SELECT_POST_FOLDER);

  static checkFreeSpace = ({ dataDir }: { dataDir: string }) =>
    ipcRenderer.invoke(ipcConsts.SMESHER_CHECK_FREE_SPACE, { dataDir });

  static getEstimatedRewards = () =>
    ipcRenderer.invoke(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS);

  static startSmeshing = async (postSetupOpts: PostSetupOpts) => {
    await ipcRenderer.invoke(ipcConsts.SWITCH_API_PROVIDER, LOCAL_NODE_API_URL);
    await ipcRenderer.invoke(ipcConsts.N_M_START_NODE);
    ipcRenderer.invoke(ipcConsts.SMESHER_START_SMESHING, { postSetupOpts });
  };

  static stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    ipcRenderer.invoke(ipcConsts.SMESHER_STOP_SMESHING, { deleteFiles });

  /** **********************************   TRANSACTIONS   ************************************** */

  static sendTx = ({
    fullTx,
    accountIndex,
  }: {
    fullTx: TxSendRequest;
    accountIndex: number;
  }): Promise<ReturnType<TransactionManager['sendTx']>> =>
    ipcRenderer.invoke(ipcConsts.W_M_SEND_TX, { fullTx, accountIndex });

  static updateTransactionNote = (
    accountIndex: number,
    txId: HexString,
    note: string
  ) =>
    ipcRenderer.invoke(ipcConsts.W_M_UPDATE_TX_NOTE, {
      accountIndex,
      txId,
      note,
    });

  /** ************************************   AUTOSTART   ************************************** */

  static isAutoStartEnabled = () =>
    ipcRenderer.invoke(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);

  static toggleAutoStart = () => ipcRenderer.send(ipcConsts.TOGGLE_AUTO_START);

  /** **************************************   MISC   ***************************************** */

  static reloadApp = () => ipcRenderer.send(ipcConsts.RELOAD_APP);

  static print = ({ content }: { content: string }) =>
    ipcRenderer.send(ipcConsts.PRINT, { content });

  static signMessage = ({
    message,
    accountIndex,
  }: {
    message: string;
    accountIndex: number;
  }) =>
    ipcRenderer.invoke(ipcConsts.W_M_SIGN_MESSAGE, { message, accountIndex });

  static switchNetwork = (netId: number) =>
    ipcRenderer.invoke(ipcConsts.SWITCH_NETWORK, netId);

  static switchApiProvider = (apiUrl: SocketAddress | null) =>
    ipcRenderer.invoke(ipcConsts.SWITCH_API_PROVIDER, apiUrl);

  /** **************************************  WALLET MANAGER  **************************************** */

  static getNetworkDefinitions = (): Promise<NetworkDefinitions> =>
    ipcRenderer.invoke(ipcConsts.W_M_GET_NETWORK_DEFINITIONS);

  static getCurrentLayer = (): Promise<CurrentLayer> =>
    ipcRenderer.invoke(ipcConsts.W_M_GET_CURRENT_LAYER);

  static getGlobalStateHash = (): Promise<GlobalStateHash> =>
    ipcRenderer.invoke(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);

  /** **************************************  NODE MANAGER  **************************************** */

  static restartNode = () => ipcRenderer.invoke(ipcConsts.N_M_RESTART_NODE);

  static requestVersionAndBuild = () =>
    ipcRenderer.send(ipcConsts.N_M_GET_VERSION_AND_BUILD);

  static setPort = ({ port }: { port: string }) =>
    ipcRenderer.send(ipcConsts.SET_NODE_PORT, { port });

  static changeDataDir = () =>
    ipcRenderer.invoke(ipcConsts.PROMPT_CHANGE_DATADIR);

  /** **************************************  AUTO UPDATER  **************************************** */
  static downloadUpdate = () => ipcRenderer.send(ipcConsts.AU_REQUEST_DOWNLOAD);

  static installUpdate = () => ipcRenderer.send(ipcConsts.AU_REQUEST_INSTALL);
}

ipcRenderer.on(ipcConsts.N_M_SET_NODE_STATUS, (_event, status: NodeStatus) => {
  store.dispatch(setNodeStatus(status));
});
ipcRenderer.on(ipcConsts.N_M_SET_NODE_ERROR, (_event, error: NodeError) => {
  store.dispatch(setNodeError(error));
});

ipcRenderer.on(
  ipcConsts.N_M_GET_VERSION_AND_BUILD,
  (_event, payload: NodeVersionAndBuild) => {
    store.dispatch(setVersionAndBuild(payload));
  }
);

ipcRenderer.on(ipcConsts.T_M_UPDATE_ACCOUNT, (_event, request) => {
  store.dispatch(
    updateAccountData({
      account: request.account,
      accountId: request.accountId,
    })
  );
});

ipcRenderer.on(ipcConsts.T_M_UPDATE_TXS, (_event, request) => {
  store.dispatch(
    setTransactions({ txs: request.txs, publicKey: request.publicKey })
  );
});

ipcRenderer.on(ipcConsts.T_M_UPDATE_REWARDS, (_event, request) => {
  const { rewards, publicKey } = request;
  store.dispatch({
    type: SET_ACCOUNT_REWARDS,
    payload: { rewards, publicKey },
  });
});

ipcRenderer.on(
  ipcConsts.SMESHER_SET_SETTINGS_AND_STARTUP_STATUS,
  (_event, request: IPCSmesherStartupData) => {
    store.dispatch({
      type: SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
      payload: request,
    });
  }
);

ipcRenderer.on(ipcConsts.SMESHER_SEND_SMESHING_CONFIG, (_event, request) => {
  const { smeshingConfig } = request;
  store.dispatch({ type: SET_SMESHER_CONFIG, payload: { smeshingConfig } });
});

ipcRenderer.on(
  ipcConsts.SMESHER_SET_SETUP_COMPUTE_PROVIDERS,
  (_event, request) => {
    const { providers } = request;
    store.dispatch({
      type: SET_SETUP_COMPUTE_PROVIDERS,
      payload: providers,
    });
  }
);

ipcRenderer.on(
  ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS,
  (_event, request) => {
    const {
      error,
      status: { postSetupState, numLabelsWritten, errorMessage },
    } = request;
    if (postSetupState === PostSetupState.STATE_COMPLETE) {
      localStorage.setItem(
        'smesherSmeshingTimestamp',
        `${new Date().getTime()}`
      );
    }
    store.dispatch({
      type: SET_POST_DATA_CREATION_STATUS,
      payload: { error, postSetupState, numLabelsWritten, errorMessage },
    });
  }
);

ipcRenderer.on(ipcConsts.AU_AVAILABLE, (_, info: UpdateInfo) => {
  store.dispatch(updaterSlice.actions.updateAvailable(info));
});

ipcRenderer.on(ipcConsts.AU_DOWNLOADED, (_, info: UpdateInfo) => {
  store.dispatch(updaterSlice.actions.updateDownloaded(info));
});

ipcRenderer.on(ipcConsts.AU_ERROR, (_, error: Error) => {
  console.error('Auto-Update error\n', error); // eslint-disable-line no-console
  store.dispatch(updaterSlice.actions.setError(error));
});

ipcRenderer.on(ipcConsts.AU_DOWNLOAD_STARTED, (_) => {
  store.dispatch(updaterSlice.actions.setDownloading(true));
});

ipcRenderer.on(ipcConsts.AU_DOWNLOAD_PROGRESS, (_, info: ProgressInfo) => {
  store.dispatch(updaterSlice.actions.updateProgress(info));
});

ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
  store.dispatch(showClosingAppModal());
});

export default EventsService;
