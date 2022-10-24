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
  About = 'https://testnet.spacemesh.io',
  UserGuide = 'https://testnet.spacemesh.io',
  Terms = 'https://testnet.spacemesh.io/#/terms',
  Disclaimer = 'https://testnet.spacemesh.io/#/disclaimer',
  Privacy = 'https://testnet.spacemesh.io/#/privacy',
  SetupGuide = 'https://testnet.spacemesh.io/#/guide/setup',
  NoSleepGuide = 'https://testnet.spacemesh.io/#/no_sleep',
  SendCoinGuide = 'https://testnet.spacemesh.io/#/send_coin',
  GetCoinGuide = 'https://testnet.spacemesh.io/#/get_coin',
  WalletGuide = 'https://testnet.spacemesh.io/#/wallet',
  BackupGuide = 'https://testnet.spacemesh.io/#/backup',
  RestoreGuide = 'https://testnet.spacemesh.io/#/advanced_wallet?id=restoring-a-wallet',
  RestoreFileGuide = 'https://testnet.spacemesh.io/#/backup?id=restoring-from-a-backup-file',
  RestoreMnemoGuide = 'https://testnet.spacemesh.io/#/backup?id=restoring-from-a-12-words-list',
  Help = 'https://testnet.spacemesh.io/#/help',
  DiscordTapAccount = 'https://discord.gg/ASpy52C',
}

// TODO: When the API will be available to retrieve max gas
// for the tx method before publishing it
export const MAX_GAS = 500;
