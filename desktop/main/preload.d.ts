export type Channels =
  | 'AU_DOWNLOAD_PROGRESS'
  | 'AU_DOWNLOAD_STARTED'
  | 'CLOSING_APP'
  | 'AU_ERROR'
  | 'AU_DOWNLOAD_COMPLETE'
  | 'AU_AVAILABLE'
  | 'SMESHER_POST_DATA_CREATION_PROGRESS'
  | 'SMESHER_SET_SETUP_COMPUTE_PROVIDERS'
  | 'SMESHER_SEND_SMESHING_CONFIG'
  | 'SMESHER_SET_SETTINGS_AND_STARTUP_STATUS'
  | 'T_M_UPDATE_REWARDS'
  | 'T_M_UPDATE_TXS'
  | 'T_M_UPDATE_ACCOUNT'
  | 'N_M_SET_NODE_ERROR'
  | 'N_M_SET_NODE_STATUS'
  | 'IPC_BATCH_SYNC'
  | 'AU_REQUEST_INSTALL'
  | 'BROWSER_READY'
  | 'REQUEST_SWITCH_API'
  | 'WALLET_ACTIVATED'
  | 'W_M_CREATE_WALLET'
  | 'READ_WALLET_FILES'
  | 'GET_OS_THEME_COLOR'
  | 'OPEN_BROWSER_VIEW'
  | 'SEND_THEME_COLOR'
  | 'DESTROY_BROWSER_VIEW'
  | 'LIST_NETWORKS'
  | 'LIST_PUBLIC_SERVICES'
  | 'W_M_UNLOCK_WALLET'
  | 'W_M_UPDATE_WALLET_META'
  | 'W_M_RENAME_ACCOUNT'
  | 'W_M_ADD_CONTACT'
  | 'W_M_REMOVE_CONTACT'
  | 'W_M_CHANGE_PASSWORD'
  | 'W_M_CREATE_NEW_ACCOUNT'
  | 'W_M_BACKUP_WALLET'
  | 'W_M_ADD_WALLET_PATH'
  | 'W_M_SHOW_FILE_IN_FOLDER'
  | 'W_M_SHOW_DELETE_FILE'
  | 'W_M_WIPE_OUT'
  | 'SMESHER_SELECT_POST_FOLDER'
  | 'SMESHER_CHECK_FREE_SPACE'
  | 'SMESHER_GET_ESTIMATED_REWARDS'
  | 'SMESHER_START_SMESHING'
  | 'SMESHER_STOP_SMESHING'
  | 'W_M_SEND_TX'
  | 'W_M_SPAWN_TX'
  | 'W_M_UPDATE_TX_NOTE'
  | 'IS_AUTO_START_ENABLED_REQUEST'
  | 'TOGGLE_AUTO_START'
  | 'RELOAD_APP'
  | 'PRINT'
  | 'W_M_SIGN_MESSAGE'
  | 'SWITCH_NETWORK'
  | 'SWITCH_API_PROVIDER'
  | 'W_M_GET_CURRENT_LAYER'
  | 'W_M_GET_GLOBAL_STATE_HASH'
  | 'N_M_RESTART_NODE'
  | 'N_M_GET_VERSION_AND_BUILD'
  | 'SET_NODE_PORT'
  | 'PROMPT_CHANGE_DATADIR'
  | 'AU_REQUEST_DOWNLOAD'
  | 'W_M_CLOSE_WALLET'
  | 'REQUEST_SWITCH_NETWORK';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send(channel: Channels, ...args: any[]): void;
        on(
          channel: Channels,
          func: (...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: any[]) => void): void;
        invoke<Return>(channel: Channels, ...args: any[]): Promise<Return>;
      };
    };
  }
}

export {};
