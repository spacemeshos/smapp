import pkg from '../package.json';
import { NodeStatus, TxState } from './types';

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
  RedistWindowsInstallOfficialSite = 'https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2015-2017-2019-and-2022',
  OpenCLWindowsInstallGuide = 'https://sasview.org/docs/old_docs/4.1.2/user/opencl_installation.html',
  OpenCLUbuntuInstallGuide = 'https://saturncloud.io/blog/how-to-install-cudaopencl-on-ubuntu-installed-on-a-usb-drive/#installing-opencl',
  GithubSMAppIssuePage = 'https://github.com/spacemeshos/smapp/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=',
  PosProvingDocumentation = 'https://github.com/spacemeshos/wiki/wiki/Smesher-Guide#fine-tuning-proving',
}

export const BITS_PER_LABEL = 128;

export const MINUTE = 60 * 1000;

export const HOUR = MINUTE * 60;

export const DAY = HOUR * 24;

export const DEFAULT_MAINNET_CONFIG = {
  main: {
    'layer-duration': '5m',
    'layers-per-epoch': 4032,
  },
  post: {
    'post-labels-per-unit': 4294967296,
    'post-max-numunits': 1048576,
  },
  poet: {
    'cycle-gap': '12h',
  },
  genesis: {
    'genesis-time': '2023-07-14T08:00:00Z',
    'genesis-extra-data':
      '00000000000000000001a6bc150307b5c1998045752b3c87eccf3c013036f3cc',
  },
};

export const DEFAULT_NETWORKS_LIST = [
  {
    netName: 'Main Network',
    conf: 'https://configs.spacemesh.network/config.mainnet.json',
    grpcAPI: 'https://mainnet-api.spacemesh.network/',
    jsonAPI: 'https://mainnet-api-json.spacemesh.network/',
    explorer: 'https://explorer.spacemesh.io/',
    dash: 'https://dash.spacemesh.io/',
    minSmappRelease: pkg.version,
    latestSmappRelease: pkg.version,
    smappBaseDownloadUrl: 'https://smapp.spacemesh.network/dist',
    genesisID: '7c8cef2bfd54447d60c3ffcc5daf974b24b74605',
    config: DEFAULT_MAINNET_CONFIG,
  },
];
