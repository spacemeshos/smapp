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
  Bech32Address,
  HexString,
  IPCSmesherStartupData,
  NodeError,
  NodeStatus,
  NodeVersionAndBuild,
  PostSetupOpts,
  PostSetupState,
  SocketAddress,
  TxSendRequest,
  WalletMeta,
} from '../../../shared/types';
import { addWarning, showClosingAppModal } from '../../redux/ui/actions';
// Temporary solution to provide types
// Could be replaced using something like `electron-ipcfy`
import TransactionManager from '../../../desktop/TransactionManager';
import updaterSlice from '../../redux/updater/slice';
import { CurrentLayer, GlobalStateHash } from '../../types/events';
import {
  AddContactRequest,
  AppLogs,
  ChangePasswordRequest,
  CreateAccountResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  IpcResponse,
  ListNetworksResponse,
  ListPublicApisResponse,
  RemoveContactRequest,
  RenameAccountRequest,
  UnlockWalletRequest,
  UnlockWalletResponse,
} from '../../../shared/ipcMessages';

class EventsService {
  static createWallet = ({
    password,
    existingMnemonic,
    type,
    apiUrl,
    genesisID,
  }: CreateWalletRequest): Promise<CreateWalletResponse> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_CREATE_WALLET, {
      password,
      existingMnemonic,
      type,
      apiUrl,
      genesisID,
    });

  static readWalletFiles = () =>
    window.electron.ipcRenderer.invoke(ipcConsts.READ_WALLET_FILES);

  static getOsThemeColor = () =>
    window.electron.ipcRenderer.invoke(ipcConsts.GET_OS_THEME_COLOR);

  static openBrowserView = () =>
    window.electron.ipcRenderer.send(ipcConsts.OPEN_BROWSER_VIEW);

  static updateBrowserViewTheme = ({ isDarkMode }: { isDarkMode: boolean }) =>
    window.electron.ipcRenderer.send(ipcConsts.SEND_THEME_COLOR, {
      isDarkMode,
    });

  static destroyBrowserView = () =>
    window.electron.ipcRenderer.send(ipcConsts.DESTROY_BROWSER_VIEW);

  static listNetworks = (): Promise<ListNetworksResponse> =>
    window.electron.ipcRenderer.invoke(ipcConsts.LIST_NETWORKS);

  static listPublicServices = (
    genesisID: string
  ): Promise<ListPublicApisResponse> =>
    window.electron.ipcRenderer.invoke(
      ipcConsts.LIST_PUBLIC_SERVICES,
      genesisID
    );

  static unlockWallet = (
    payload: UnlockWalletRequest
  ): Promise<UnlockWalletResponse> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_UNLOCK_WALLET, payload);

  static closeWallet = () =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_CLOSE_WALLET);

  static updateWalletMeta = <T extends keyof WalletMeta>(
    key: T,
    value: WalletMeta[T]
  ) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_UPDATE_WALLET_META, {
      key,
      value,
    });

  static renameAccount = (payload: RenameAccountRequest) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_RENAME_ACCOUNT, payload);

  static addContact = (payload: AddContactRequest) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_ADD_CONTACT, payload);

  static removeContact = (payload: RemoveContactRequest) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_REMOVE_CONTACT, payload);

  static changePassword = (payload: ChangePasswordRequest) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_CHANGE_PASSWORD, payload);

  static createNewAccount = ({
    path,
    password,
  }: UnlockWalletRequest): Promise<CreateAccountResponse> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_CREATE_NEW_ACCOUNT, {
      path,
      password,
    });

  static backupWallet = (filePath: string) =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_BACKUP_WALLET, filePath);

  static addWalletPath = (filePath: string) =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_ADD_WALLET_PATH, filePath);

  static showFileInFolder = ({
    filePath,
    isLogFile,
  }: {
    filePath?: string;
    isLogFile?: boolean;
  }) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_SHOW_FILE_IN_FOLDER, {
      filePath,
      isLogFile,
    });

  static deleteWalletFile = (filepath: string) =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_SHOW_DELETE_FILE, filepath);

  static wipeOut = () =>
    window.electron.ipcRenderer.send(ipcConsts.W_M_WIPE_OUT);

  /** ************************************   SENTRY   ****************************************** */

  static getNodeAndAppLogs = (): Promise<IpcResponse<AppLogs>> =>
    window.electron.ipcRenderer.invoke(ipcConsts.GET_NODE_AND_APP_LOGS);

  /** ************************************   SMESHER   ****************************************** */
  static selectPostFolder = () =>
    window.electron.ipcRenderer.invoke(ipcConsts.SMESHER_SELECT_POST_FOLDER);

  static checkFreeSpace = ({ dataDir }: { dataDir: string }) =>
    window.electron.ipcRenderer.invoke(ipcConsts.SMESHER_CHECK_FREE_SPACE, {
      dataDir,
    });

  static getEstimatedRewards = () =>
    window.electron.ipcRenderer.invoke(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS);

  static startSmeshing = async (postSetupOpts: PostSetupOpts) => {
    window.electron.ipcRenderer.send(
      ipcConsts.SMESHER_START_SMESHING,
      postSetupOpts
    );
  };

  static stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    window.electron.ipcRenderer.invoke(ipcConsts.SMESHER_STOP_SMESHING, {
      deleteFiles,
    });

  /** **********************************   TRANSACTIONS   ************************************** */

  static sendTx = ({
    fullTx,
    accountIndex,
  }: {
    fullTx: TxSendRequest;
    accountIndex: number;
  }): Promise<ReturnType<TransactionManager['publishSpendTx']>> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_SEND_TX, {
      fullTx,
      accountIndex,
    });

  static spawnTx = (
    fee: number,
    accountIndex: number
  ): Promise<ReturnType<TransactionManager['publishSelfSpawn']>> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_SPAWN_TX, {
      fee,
      accountIndex,
    });

  static updateTransactionNote = (
    address: Bech32Address,
    txId: HexString,
    note: string
  ) =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_UPDATE_TX_NOTE, {
      address,
      txId,
      note,
    });

  /** ************************************   AUTOSTART   ************************************** */

  static isAutoStartEnabled = () =>
    window.electron.ipcRenderer.invoke(ipcConsts.IS_AUTO_START_ENABLED_REQUEST);

  static toggleAutoStart = (): Promise<{ status: boolean; error?: string }> =>
    window.electron.ipcRenderer.invoke(ipcConsts.TOGGLE_AUTO_START);

  /** **************************************   MISC   ***************************************** */

  static print = ({ content }: { content: string }) =>
    window.electron.ipcRenderer.send(ipcConsts.PRINT, { content });

  static signMessage = ({
    message,
    accountIndex,
  }: {
    message: string;
    accountIndex: number;
  }) =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_SIGN_MESSAGE, {
      message,
      accountIndex,
    });

  static switchNetwork = (genesisID: string) => {
    window.electron.ipcRenderer.send(ipcConsts.SWITCH_NETWORK, genesisID);
  };

  static switchApiProvider = (
    apiUrl: SocketAddress | null,
    genesisID: string
  ) =>
    window.electron.ipcRenderer.invoke(ipcConsts.SWITCH_API_PROVIDER, {
      apiUrl,
      genesisID,
    });

  /** **************************************  WALLET MANAGER  **************************************** */

  static getCurrentLayer = (): Promise<CurrentLayer> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_GET_CURRENT_LAYER);

  static getGlobalStateHash = (): Promise<GlobalStateHash> =>
    window.electron.ipcRenderer.invoke(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);

  /** **************************************  NODE MANAGER  **************************************** */

  static restartNode = () =>
    window.electron.ipcRenderer.send(ipcConsts.N_M_RESTART_NODE);

  static requestVersionAndBuild = () =>
    window.electron.ipcRenderer.send(ipcConsts.N_M_GET_VERSION_AND_BUILD);

  static setPort = ({ port }: { port: string }) =>
    window.electron.ipcRenderer.send(ipcConsts.SET_NODE_PORT, { port });

  static changeDataDir = () =>
    window.electron.ipcRenderer.invoke(ipcConsts.PROMPT_CHANGE_DATADIR);

  /** **************************************  AUTO UPDATER  **************************************** */
  static downloadUpdate = () =>
    window.electron.ipcRenderer.send(ipcConsts.AU_REQUEST_DOWNLOAD);

  static installUpdate = () =>
    window.electron.ipcRenderer.send(ipcConsts.AU_REQUEST_INSTALL);
}

window.electron.ipcRenderer.on(
  ipcConsts.N_M_SET_NODE_STATUS,
  (_event, status: NodeStatus) => {
    store.dispatch(setNodeStatus(status));
  }
);
window.electron.ipcRenderer.on(
  ipcConsts.N_M_SET_NODE_ERROR,
  (_event, error: NodeError) => {
    store.dispatch(setNodeError(error));
  }
);

window.electron.ipcRenderer.on(ipcConsts.NEW_WARNING, (_event, error: any) => {
  store.dispatch(addWarning(error));
});
window.electron.ipcRenderer.on(
  ipcConsts.N_M_GET_VERSION_AND_BUILD,
  (_event, payload: NodeVersionAndBuild) => {
    store.dispatch(setVersionAndBuild(payload));
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.T_M_UPDATE_ACCOUNT,
  (_event, request) => {
    store.dispatch(
      updateAccountData({
        account: request.account,
        accountId: request.accountId,
      })
    );
  }
);

window.electron.ipcRenderer.on(ipcConsts.T_M_UPDATE_TXS, (_event, request) => {
  store.dispatch(
    setTransactions({ txs: request.txs, publicKey: request.publicKey })
  );
});

window.electron.ipcRenderer.on(
  ipcConsts.T_M_UPDATE_REWARDS,
  (_event, request) => {
    const { rewards, publicKey } = request;
    store.dispatch({
      type: SET_ACCOUNT_REWARDS,
      payload: { rewards, publicKey },
    });
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.SMESHER_SET_SETTINGS_AND_STARTUP_STATUS,
  (_event, request: IPCSmesherStartupData) => {
    store.dispatch({
      type: SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
      payload: request,
    });
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.SMESHER_SEND_SMESHING_CONFIG,
  (_event, request) => {
    const { smeshingConfig } = request;
    store.dispatch({ type: SET_SMESHER_CONFIG, payload: { smeshingConfig } });
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.SMESHER_SET_SETUP_COMPUTE_PROVIDERS,
  (_event, request) => {
    const { providers } = request;
    store.dispatch({
      type: SET_SETUP_COMPUTE_PROVIDERS,
      payload: providers,
    });
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS,
  (_event, request) => {
    const {
      status: { postSetupState, numLabelsWritten },
    } = request;
    if (postSetupState === PostSetupState.STATE_COMPLETE) {
      localStorage.setItem(
        'smesherSmeshingTimestamp',
        `${new Date().getTime()}`
      );
    }

    store.dispatch({
      type: SET_POST_DATA_CREATION_STATUS,
      payload: { postSetupState, numLabelsWritten },
    });
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.AU_AVAILABLE,
  (_, info: UpdateInfo) => {
    store.dispatch(updaterSlice.actions.updateAvailable(info));
  }
);

window.electron.ipcRenderer.on(
  ipcConsts.AU_DOWNLOADED,
  (_, info: UpdateInfo) => {
    store.dispatch(updaterSlice.actions.updateDownloaded(info));
  }
);

window.electron.ipcRenderer.on(ipcConsts.AU_ERROR, (_, error: Error) => {
  console.error('Auto-Update error\n', error); // eslint-disable-line no-console
  store.dispatch(updaterSlice.actions.setError(error));
});

window.electron.ipcRenderer.on(ipcConsts.AU_DOWNLOAD_STARTED, (_) => {
  store.dispatch(updaterSlice.actions.setDownloading(true));
});

window.electron.ipcRenderer.on(
  ipcConsts.AU_DOWNLOAD_PROGRESS,
  (_, info: ProgressInfo) => {
    store.dispatch(updaterSlice.actions.updateProgress(info));
  }
);

window.electron.ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
  store.dispatch(showClosingAppModal());
});

export default EventsService;
