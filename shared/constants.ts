import { NodeStatus, SocketAddress, TxState } from './types';

export const LOCAL_NODE_API_URL: SocketAddress = {
  host: 'localhost',
  port: '9092',
  protocol: 'http:',
};

export const TX_STATE_LABELS: Record<TxState, string> = {
  [TxState.UNSPECIFIED]: 'Unknown state',
  [TxState.REJECTED]: 'Rejected',
  [TxState.CONFLICTING]: 'Conflicting',
  [TxState.INSUFFICIENT_FUNDS]: 'Insufficient funds',
  [TxState.MEMPOOL]: 'Pending',
  [TxState.MESH]: 'Accepted',
  [TxState.PROCESSED]: 'Confirmed',
  [TxState.SUCCESS]: 'Applied',
  [TxState.FAILURE]: 'Failed to apply',
  [TxState.INVALID]: 'Invalid transaction',
};

export const DEFAULT_NODE_STATUS: NodeStatus = {
  connectedPeers: 0,
  isSynced: false,
  syncedLayer: 0,
  topLayer: 0,
  verifiedLayer: 0,
};

export enum ExternalLinks {
  About = 'https://testnet.spacemesh.io',
  UserGuide = 'https://testnet.spacemesh.io',
  Terms = 'https://testnet.spacemesh.io/#/terms',
  Disclaimer = 'https://testnet.spacemesh.io/#/disclaimer',
  Discord = 'https://discord.com/invite/yVhQ7rC',
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
