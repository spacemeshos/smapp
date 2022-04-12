import { SocketAddress, TxState } from './types';

export const LOCAL_NODE_API_URL: SocketAddress = {
  host: 'localhost',
  port: '9092',
  protocol: 'http:',
};

export const TX_STATE_LABELS: Record<TxState, string> = {
  [TxState.TRANSACTION_STATE_UNSPECIFIED]: 'Unknown state',
  [TxState.TRANSACTION_STATE_REJECTED]: 'Rejected',
  [TxState.TRANSACTION_STATE_CONFLICTING]: 'Conflicting',
  [TxState.TRANSACTION_STATE_INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [TxState.TRANSACTION_STATE_MEMPOOL]: 'Pending',
  [TxState.TRANSACTION_STATE_MESH]: 'Accepted',
  [TxState.TRANSACTION_STATE_PROCESSED]: 'Confirmed',
};

export enum ExternalLinks {
  Terms = 'https://testnet.spacemesh.io/#/terms',
  Disclaimer = 'https://testnet.spacemesh.io/#/disclaimer',
  Privacy = 'https://testnet.spacemesh.io/#/privacy',
  UserGuide = 'https://testnet.spacemesh.io',
}
