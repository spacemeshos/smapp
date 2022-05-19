import { Subject } from 'rxjs';
import { NodeConfig, Wallet } from '../../shared/types';
import NodeManager from '../NodeManager';
import SmesherManager from '../SmesherManager';
import WalletManager from '../WalletManager';

export type Managers = {
  smesher: SmesherManager;
  node: NodeManager;
  wallet: WalletManager;
};

const getDefaultNetwork = () => ({
  netID: -1,
  netName: 'Unknown',
  conf: '',
  explorer: '',
  dash: '',
  grpcAPI: '',
  jsonAPI: '',
  minNodeVersion: '',
  maxNodeVersion: '',
  minSmappRelease: '',
  latestSmappRelease: '',
  smappBaseDownloadUrl: '',
  nodeBaseDownloadUrl: '',
});

export type Network = ReturnType<typeof getDefaultNetwork> & {
  [key: string]: any;
};

export type AppState = {
  wallet: Wallet | null;
  walletPath: string;
  networks: Network[];
  currentNetwork: Network;
  nodeConfig: NodeConfig;
  managers: Managers;
};

export type AppStore = {
  get: () => Promise<AppState>;
  unsubscribe: () => void;
  subjects: Record<string, Subject<any>>;
  [k: string]: any;
};
