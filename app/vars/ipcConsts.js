const ipcConsts = {
  // node fs calls
  SAVE_FILE: 'SAVE_FILE',
  SAVE_FILE_SUCCESS: 'SAVE_FILE_SUCCESS',
  SAVE_FILE_FAILURE: 'SAVE_FILE_FAILURE',
  READ_FILE: 'READ_FILE',
  READ_FILE_SUCCESS: 'READ_FILE_SUCCESS',
  READ_FILE_FAILURE: 'READ_FILE_FAILURE',
  COPY_FILE: 'COPY_FILE',
  COPY_FILE_SUCCESS: 'COPY_FILE_SUCCESS',
  COPY_FILE_FAILED: 'COPY_FILE_FAILED',
  READ_DIRECTORY: 'READ_DIRECTORY',
  READ_DIRECTORY_SUCCESS: 'READ_DIRECTORY_SUCCESS',
  READ_DIRECTORY_FAILURE: 'READ_DIRECTORY_FAILURE',
  UPDATE_FILE: 'UPDATE_FILE',
  UPDATE_FILE_SUCCESS: 'UPDATE_FILE_SUCCESS',
  UPDATE_FILE_FAILURE: 'UPDATE_FILE_FAILURE',
  GET_DRIVE_LIST: 'GET_DRIVE_LIST',
  GET_DRIVE_LIST_SUCCESS: 'GET_DRIVE_LIST_SUCCESS',
  PRINT: 'PRINT',
  OPEN_WALLET_BACKUP_DIRECTORY: 'OPEN_WALLET_BACKUP_DIRECTORY',
  OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS: 'OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS',
  OPEN_WALLET_BACKUP_DIRECTORY_FAILURE: 'OPEN_WALLET_BACKUP_DIRECTORY_FAILURE',
  SET_NODE_IP: 'SET_NODE_IP',
  SET_NODE_IP_SUCCESS: 'SET_NODE_IP_SUCCESS',
  SET_NODE_IP_FAILURE: 'SET_NODE_IP_FAILURE',
  NOTIFICATION_CLICK: 'NOTIFICATION_CLICK',
  DELETE_FILE: 'DELETE_FILE',
  WIPE_OUT: 'WIPE_OUT',
  TOGGLE_AUTO_START: 'TOGGLE_AUTO_START',
  IS_AUTO_START_ENABLED_REQUEST: 'IS_AUTO_START_ENABLED_REQUEST',
  IS_AUTO_START_ENABLED_REQUEST_RESPONSE: 'IS_AUTO_START_ENABLED_REQUEST_RESPONSE',
  START_NODE: 'START_NODE',
  START_NODE_SUCCESS: 'START_NODE_SUCCESS',
  START_NODE_FAILURE: 'START_NODE_FAILURE',
  HARD_REFRESH: 'HARD_REFRESH',
  REQUEST_CLOSE: 'REQUEST_CLOSE',
  QUIT_NODE: 'QUIT_NODE',
  QUIT_APP: 'QUIT_APP',
  KEEP_RUNNING_IN_BACKGROUND: 'KEEP_RUNNING_IN_BACKGROUND',
  // gRPC calls
  // Node management
  CHECK_NODE_CONNECTION: 'CHECK_NODE_CONNECTION',
  CHECK_NODE_CONNECTION_SUCCESS: 'CHECK_NODE_CONNECTION_SUCCESS',
  CHECK_NODE_CONNECTION_FAILURE: 'CHECK_NODE_CONNECTION_FAILURE',
  GET_MINING_STATUS: 'GET_MINING_STATUS',
  GET_MINING_STATUS_SUCCESS: 'GET_MINING_STATUS_SUCCESS',
  GET_MINING_STATUS_FAILURE: 'GET_MINING_STATUS_FAILURE',
  INIT_MINING: 'INIT_MINING',
  INIT_MINING_SUCCESS: 'INIT_MINING_SUCCESS',
  INIT_MINING_FAILURE: 'INIT_MINING_FAILURE',
  GET_GENESIS_TIME: 'GET_GENESIS_TIME',
  GET_GENESIS_TIME_SUCCESS: 'GET_GENESIS_TIME_SUCCESS',
  GET_GENESIS_TIME_FAILURE: 'GET_GENESIS_TIME_FAILURE',
  GET_UPCOMING_AWARDS: 'GET_UPCOMING_AWARDS',
  GET_UPCOMING_AWARDS_SUCCESS: 'GET_UPCOMING_AWARDS_SUCCESS',
  GET_UPCOMING_AWARDS_FAILURE: 'GET_UPCOMING_AWARDS_FAILURE',
  SET_AWARDS_ADDRESS: 'SET_AWARDS_ADDRESS',
  SET_AWARDS_ADDRESS_SUCCESS: 'SET_AWARDS_ADDRESS_SUCCESS',
  SET_AWARDS_ADDRESS_FAILURE: 'SET_AWARDS_ADDRESS_FAILURE',
  // Wallet management
  CHECK_WALLET_UPDATE: 'CHECK_WALLET_UPDATE',
  CHECK_WALLET_UPDATE_SUCCESS: 'CHECK_WALLET_UPDATE_SUCCESS',
  WALLET_UPDATE_ERROR: 'WALLET_UPDATE_ERROR',
  DOWNLOAD_UPDATE_COMPLETED: 'DOWNLOAD_UPDATE_COMPLETED',
  QUIT_AND_UPDATE: 'QUIT_AND_UPDATE',
  CHECK_APP_VISIBLITY: 'CHECK_APP_VISIBLITY',
  APP_VISIBLE: 'APP_VISIBLE',
  APP_HIDDEN: 'APP_HIDDEN',
  GET_BALANCE: 'GET_BALANCE',
  GET_BALANCE_SUCCESS: 'GET_BALANCE_SUCCESS',
  GET_BALANCE_FAILURE: 'GET_BALANCE_FAILURE',
  GET_NONCE: 'GET_NONCE',
  GET_NONCE_SUCCESS: 'GET_NONCE_SUCCESS',
  GET_NONCE_FAILURE: 'GET_NONCE_FAILURE',
  SEND_TX: 'SEND_TX',
  SEND_TX_SUCCESS: 'SEND_TX_SUCCESS',
  SEND_TX_FAILURE: 'SEND_TX_FAILURE',
  GET_LATEST_VALID_LAYER_ID: 'GET_LATEST_VALID_LAYER_ID',
  GET_LATEST_VALID_LAYER_ID_SUCCESS: 'GET_LATEST_VALID_LAYER_ID_SUCCESS',
  GET_LATEST_VALID_LAYER_ID_FAILURE: 'GET_LATEST_VALID_LAYER_ID_FAILURE',
  GET_TX_LIST: 'GET_TX_LIST',
  GET_TX_LIST_SUCCESS: 'GET_TX_LIST_SUCCESS',
  GET_TX_LIST_FAILURE: 'GET_TX_LIST_FAILURE'
};

export default ipcConsts;
