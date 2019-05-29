const ipcConsts = {
  // node fs calls
  SAVE_FILE: 'SAVE_FILE',
  SAVE_FILE_SUCCESS: 'SAVE_FILE_SUCCESS',
  SAVE_FILE_FAILURE: 'SAVE_FILE_FAILURE',
  READ_FILE: 'READ_FILE',
  READ_FILE_SUCCESS: 'READ_FILE_SUCCESS',
  READ_FILE_FAILURE: 'READ_FILE_FAILURE',
  GET_FILE_NAME: 'GET_FILE_NAME',
  GET_FILE_NAME_SUCCESS: 'GET_FILE_NAME_SUCCESS',
  GET_FILE_NAME_FAILURE: 'GET_FILE_NAME_FAILURE',
  READ_DIRECTORY: 'READ_DIRECTORY',
  READ_DIRECTORY_SUCCESS: 'READ_DIRECTORY_SUCCESS',
  READ_DIRECTORY_FAILURE: 'READ_DIRECTORY_FAILURE',
  UPDATE_FILE: 'UPDATE_FILE',
  UPDATE_FILE_SUCCESS: 'UPDATE_FILE_SUCCESS',
  UPDATE_FILE_FAILURE: 'UPDATE_FILE_FAILURE',
  GET_DRIVE_LIST: 'GET_DRIVE_LIST',
  GET_DRIVE_LIST_SUCCESS: 'GET_DRIVE_LIST_SUCCESS',
  GET_DRIVE_LIST_FAILURE: 'GET_DRIVE_LIST_FAILURE',
  GET_AVAILABLE_DISK_SPACE: 'GET_AVAILABLE_DISK_SPACE',
  GET_AVAILABLE_DISK_SPACE_SUCCESS: 'GET_AVAILABLE_DISK_SPACE_SUCCESS',
  GET_AVAILABLE_DISK_SPACE_FAILURE: 'GET_AVAILABLE_DISK_SPACE_FAILURE',
  PRINT: 'PRINT',
  OPEN_WALLET_BACKUP_DIRECTORY: 'OPEN_WALLET_BACKUP_DIRECTORY',
  OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS: 'OPEN_WALLET_BACKUP_DIRECTORY_SUCCESS',
  OPEN_WALLET_BACKUP_DIRECTORY_FAILURE: 'OPEN_WALLET_BACKUP_DIRECTORY_FAILURE',
  SET_NODE_IP: 'SET_NODE_IP',
  SET_NODE_IP_SUCCESS: 'SET_NODE_IP_SUCCESS',
  SET_NODE_IP_FAILURE: 'SET_NODE_IP_FAILURE',
  CAN_NOTIFY: 'CAN_NOTIFY',
  CAN_NOTIFY_SUCCESS: 'CAN_NOTIFY_SUCCESS',
  CAN_NOTIFY_FAILURE: 'CAN_NOTIFY_FAILURE',
  NOTIFICATION_CLICK: 'NOTIFICATION_CLICK',
  // gRPC calls
  GET_BALANCE: 'GET_BALANCE',
  GET_BALANCE_SUCCESS: 'GET_BALANCE_SUCCESS',
  GET_BALANCE_FAILURE: 'GET_BALANCE_FAILURE',
  SEND_TX: 'SEND_TX',
  SEND_TX_SUCCESS: 'SEND_TX_SUCCESS',
  SEND_TX_FAILURE: 'SEND_TX_FAILURE',
  GET_INIT_PROGRESS: 'GET_INIT_PROGRESS',
  GET_INIT_PROGRESS_SUCCESS: 'GET_INIT_PROGRESS_SUCCESS',
  GET_INIT_PROGRESS_FAILURE: 'GET_INIT_PROGRESS_FAILURE',
  GET_TOTAL_EARNINGS: 'GET_TOTAL_EARNINGS',
  GET_TOTAL_EARNINGS_SUCCESS: 'GET_TOTAL_EARNINGS_SUCCESS',
  GET_TOTAL_EARNINGS_FAILURE: 'GET_TOTAL_EARNINGS_FAILURE',
  GET_UPCOMING_EARNINGS: 'GET_UPCOMING_EARNINGS',
  GET_UPCOMING_EARNINGS_SUCCESS: 'GET_UPCOMING_EARNINGS_SUCCESS',
  GET_UPCOMING_EARNINGS_FAILURE: 'GET_UPCOMING_EARNINGS_FAILURE',
  SET_COMMITMENT_SIZE: 'SET_COMMITMENT_SIZE',
  SET_COMMITMENT_SIZE_SUCCESS: 'SET_COMMITMENT_SIZE_SUCCESS',
  SET_COMMITMENT_SIZE_FAILURE: 'SET_COMMITMENT_SIZE_FAILURE',
  SET_LOGICAL_DRIVE: 'SET_LOGICAL_DRIVE',
  SET_LOGICAL_DRIVE_SUCCESS: 'SET_LOGICAL_DRIVE_SUCCESS',
  SET_LOGICAL_DRIVE_FAILURE: 'SET_LOGICAL_DRIVE_FAILURE',
  SET_AWARDS_ADDRESS: 'SET_AWARDS_ADDRESS',
  SET_AWARDS_ADDRESS_SUCCESS: 'SET_AWARDS_ADDRESS_SUCCESS',
  SET_AWARDS_ADDRESS_FAILURE: 'SET_AWARDS_ADDRESS_FAILURE',
  CHECK_NETWORK_CONNECTION: 'CHECK_NETWORK_CONNECTION',
  CHECK_NETWORK_CONNECTION_SUCCESS: 'CHECK_NETWORK_CONNECTION_SUCCESS',
  CHECK_NETWORK_CONNECTION_FAILURE: 'CHECK_NETWORK_CONNECTION_FAILURE'
};

export default ipcConsts;
