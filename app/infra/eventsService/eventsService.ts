import { ipcRenderer } from 'electron';
import { ProgressInfo, UpdateInfo } from 'electron-updater';
import { TemplateRegistry } from '@spacemesh/sm-codec';

import { ipcConsts } from '../../vars';
import {
  setAtxsCount,
  setNodeError,
  setNodeStartupStatus,
  setNodeStatus,
  setVersionAndBuild,
  updateQuicksyncStatus,
} from '../../redux/node/actions';
import {
  addTransaction,
  setTransactions,
  updateAccountData,
} from '../../redux/wallet/actions';
import {
  SET_ACCOUNT_REWARDS,
  SET_METADATA,
  SET_POS_DATA_CREATION_STATUS,
  SET_SETUP_COMPUTE_PROVIDERS,
  SET_SMESHER_CONFIG,
  SET_SMESHER_SETTINGS_AND_STARTUP_STATUS,
  addReward,
} from '../../redux/smesher/actions';
import store from '../../redux/store';
import {
  Bech32Address,
  BenchmarkRequest,
  HexString,
  IPCSmesherStartupData,
  NodeError,
  NodeStartupState,
  NodeStatus,
  NodeVersionAndBuild,
  PostProvingOpts,
  PostSetupOpts,
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
  AddWalletResponseType,
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
import { QuicksyncStatus } from '../../../shared/types/quicksync';
import { setLastSelectedWalletPath } from '../lastSelectedWalletPath';

class EventsService {
  static createWallet = ({
    password,
    mnemonic,
    type,
    apiUrl,
    genesisID,
    name,
  }: CreateWalletRequest): Promise<CreateWalletResponse> =>
    ipcRenderer.invoke(ipcConsts.W_M_CREATE_WALLET, {
      password,
      type,
      apiUrl,
      genesisID,
      name,
      mnemonic,
    });

  static createWalletFinish = async (walletData: CreateWalletResponse) => {
    const result = await ipcRenderer.invoke(
      ipcConsts.W_M_CREATE_WALLET_FINISH,
      walletData
    );
    // Select newly created wallet in the dropdown
    setLastSelectedWalletPath(result.path);
    return result;
  };

  static readWalletFiles = () =>
    ipcRenderer.invoke(ipcConsts.READ_WALLET_FILES);

  static getOsThemeColor = () =>
    ipcRenderer.invoke(ipcConsts.GET_OS_THEME_COLOR);

  static openBrowserView = () => ipcRenderer.send(ipcConsts.OPEN_BROWSER_VIEW);

  static updateBrowserViewTheme = ({ isDarkMode }: { isDarkMode: boolean }) =>
    ipcRenderer.send(ipcConsts.SEND_THEME_COLOR, { isDarkMode });

  static destroyBrowserView = () =>
    ipcRenderer.send(ipcConsts.DESTROY_BROWSER_VIEW);

  static listNetworks = (): Promise<ListNetworksResponse> =>
    ipcRenderer.invoke(ipcConsts.LIST_NETWORKS);

  static listPublicServices = (
    genesisID: string
  ): Promise<ListPublicApisResponse> =>
    ipcRenderer.invoke(ipcConsts.LIST_PUBLIC_SERVICES, genesisID);

  static unlockWallet = (
    payload: UnlockWalletRequest
  ): Promise<UnlockWalletResponse> =>
    ipcRenderer.invoke(ipcConsts.W_M_UNLOCK_WALLET, payload);

  static closeWallet = () => ipcRenderer.send(ipcConsts.W_M_CLOSE_WALLET);

  static updateWalletMeta = <T extends keyof WalletMeta>(
    key: T,
    value: WalletMeta[T]
  ) =>
    ipcRenderer.send(ipcConsts.W_M_UPDATE_WALLET_META, {
      key,
      value,
    });

  static renameAccount = (payload: RenameAccountRequest) =>
    ipcRenderer.send(ipcConsts.W_M_RENAME_ACCOUNT, payload);

  static addContact = (payload: AddContactRequest) =>
    ipcRenderer.send(ipcConsts.W_M_ADD_CONTACT, payload);

  static removeContact = (payload: RemoveContactRequest) =>
    ipcRenderer.send(ipcConsts.W_M_REMOVE_CONTACT, payload);

  static changePassword = (payload: ChangePasswordRequest) =>
    ipcRenderer.send(ipcConsts.W_M_CHANGE_PASSWORD, payload);

  static createNewAccount = ({
    path,
    password,
  }: UnlockWalletRequest): Promise<CreateAccountResponse> =>
    ipcRenderer.invoke(ipcConsts.W_M_CREATE_NEW_ACCOUNT, {
      path,
      password,
    });

  static backupWallet = (filePath: string) =>
    ipcRenderer.invoke(ipcConsts.W_M_BACKUP_WALLET, filePath);

  static addWalletPath = (
    filePath: string
  ): Promise<IpcResponse<AddWalletResponseType>> =>
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

  static getEstimatedRewards = () =>
    ipcRenderer.invoke(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS);

  static startSmeshing = async (opts: [PostSetupOpts, PostProvingOpts]) => {
    ipcRenderer.send(ipcConsts.SMESHER_START_SMESHING, opts);
  };

  static stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    ipcRenderer.invoke(ipcConsts.SMESHER_STOP_SMESHING, { deleteFiles });

  static updateProvingOpts = (postProvingOpts: PostProvingOpts) =>
    ipcRenderer.send(ipcConsts.SMESHER_UPDATE_PROVING_OPTS, postProvingOpts);

  static runBenchmarks = (benchmarks: BenchmarkRequest[], dataDir: string) =>
    ipcRenderer.send(ipcConsts.RUN_BENCHMARKS, { benchmarks, dataDir });

  static requestPostSetupProviders = () =>
    ipcRenderer.send(ipcConsts.REQUEST_SETUP_COMPUTE_PROVIDERS);

  /** **********************************   TRANSACTIONS   ************************************** */

  static getTxMaxGas = (req: {
    templateAddress: Parameters<typeof TemplateRegistry.get>[0];
    method: Parameters<typeof TemplateRegistry.get>[1];
    payload: any;
    accountIndex: number;
  }) => ipcRenderer.invoke(ipcConsts.W_M_GET_TX_MAX_GAS, req);

  static sendTx = ({
    fullTx,
    accountIndex,
  }: {
    fullTx: TxSendRequest;
    accountIndex: number;
  }): Promise<ReturnType<TransactionManager['publishSpendTx']>> =>
    ipcRenderer.invoke(ipcConsts.W_M_SEND_TX, { fullTx, accountIndex });

  static spawnTx = (
    fee: number,
    accountIndex: number
  ): Promise<ReturnType<TransactionManager['publishSelfSpawn']>> =>
    ipcRenderer.invoke(ipcConsts.W_M_SPAWN_TX, { fee, accountIndex });

  static updateTransactionNote = (
    address: Bech32Address,
    txId: HexString,
    note: string
  ) =>
    ipcRenderer.invoke(ipcConsts.W_M_UPDATE_TX_NOTE, {
      address,
      txId,
      note,
    });

  /** ************************************   AUTOSTART   ************************************** */

  static isAutoStartEnabled = () =>
    ipcRenderer.invoke(
      ipcConsts.IS_AUTO_START_ON_SYSTEM_LAUNCH_ENABLED_REQUEST
    );

  static toggleAutoStart = (): Promise<{ status: boolean; error?: string }> =>
    ipcRenderer.invoke(ipcConsts.TOGGLE_AUTO_START_ON_SYSTEM_LAUNCH);

  /** **************************************   MISC   ***************************************** */

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

  static switchNetwork = (genesisID: string) => {
    ipcRenderer.send(ipcConsts.SWITCH_NETWORK, genesisID);
  };

  static runQuicksync = () =>
    ipcRenderer.send(ipcConsts.REQUEST_RUNNING_QUICKSYNC);

  static runQuicksyncCheck = () =>
    ipcRenderer.invoke(ipcConsts.REQUEST_QUICKSYNC_CHECK);

  static switchApiProvider = (genesisID: string, apiUrl?: SocketAddress) =>
    ipcRenderer.invoke(ipcConsts.SWITCH_API_PROVIDER, { apiUrl, genesisID });

  /** **************************************  WALLET MANAGER  **************************************** */

  static getCurrentLayer = (): Promise<CurrentLayer> =>
    ipcRenderer.invoke(ipcConsts.W_M_GET_CURRENT_LAYER);

  static getGlobalStateHash = (): Promise<GlobalStateHash> =>
    ipcRenderer.invoke(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);

  /** **************************************  NODE MANAGER  **************************************** */

  static restartNode = () => ipcRenderer.send(ipcConsts.N_M_RESTART_NODE);

  static requestVersionAndBuild = () =>
    ipcRenderer.send(ipcConsts.N_M_GET_VERSION_AND_BUILD);

  static setPort = ({ port }: { port: string }) =>
    ipcRenderer.send(ipcConsts.SET_NODE_PORT, { port });

  static changeDataDir = () =>
    ipcRenderer.invoke(ipcConsts.PROMPT_CHANGE_DATADIR);

  /** **************************************  AUTO UPDATER  **************************************** */
  static checkUpdates = () => ipcRenderer.send(ipcConsts.AU_CHECK_UPDATES);

  static downloadUpdate = () => ipcRenderer.send(ipcConsts.AU_REQUEST_DOWNLOAD);

  static installUpdate = () => ipcRenderer.send(ipcConsts.AU_REQUEST_INSTALL);
}

ipcRenderer.on(ipcConsts.N_M_SET_NODE_STATUS, (_event, status: NodeStatus) => {
  store.dispatch(setNodeStatus(status));
});
ipcRenderer.on(ipcConsts.N_M_SET_NODE_ERROR, (_event, error: NodeError) => {
  store.dispatch(setNodeError(error));
});

ipcRenderer.on(ipcConsts.NEW_WARNING, (_event, error: any) => {
  store.dispatch(addWarning(error));
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

ipcRenderer.on(ipcConsts.T_M_ADD_TX, (_, { address, tx }) => {
  store.dispatch(addTransaction(address, tx));
});

ipcRenderer.on(ipcConsts.T_M_UPDATE_REWARDS, (_event, request) => {
  const { rewards, publicKey } = request;
  store.dispatch({
    type: SET_ACCOUNT_REWARDS,
    payload: { rewards, publicKey },
  });
});

ipcRenderer.on(ipcConsts.T_M_ADD_REWARD, (_, { address, reward }) => {
  store.dispatch(addReward(address, reward));
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
  const { smeshingConfig, freeSpace } = request;
  store.dispatch({
    type: SET_SMESHER_CONFIG,
    payload: {
      smeshingConfig,
      freeSpace,
    },
  });
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
      status: { postSetupState, numLabelsWritten },
    } = request;

    store.dispatch({
      type: SET_POS_DATA_CREATION_STATUS,
      payload: { postSetupState, numLabelsWritten },
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

ipcRenderer.on(ipcConsts.SMESHER_METADATA_INFO, (_, data) => {
  store.dispatch({ type: SET_METADATA, payload: data });
});

ipcRenderer.on(
  ipcConsts.N_M_NODE_STARTUP_STATUS,
  (_, status: NodeStartupState) => {
    store.dispatch(setNodeStartupStatus(status));
  }
);

ipcRenderer.on(
  ipcConsts.UPDATE_QUICKSYNC_STATUS,
  (_, status: QuicksyncStatus) => {
    store.dispatch(updateQuicksyncStatus(status));
  }
);

ipcRenderer.on(
  ipcConsts.UPDATE_ATX_COUNT,
  (_, amount) => store.dispatch(setAtxsCount(amount))
);

export default EventsService;
