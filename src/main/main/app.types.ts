import { Subject } from 'rxjs';
import { Network, NodeConfig, Wallet } from '../../shared/types';
import NodeManager from '../NodeManager';
import SmesherManager from '../SmesherManager';
import WalletManager from '../WalletManager';

export type Managers = {
  smesher: SmesherManager;
  node: NodeManager;
  wallet: WalletManager;
};

export type AppState = {
  wallet: Wallet | null;
  walletPath: string;
  networks: Network[];
  currentNetwork: Network | null;
  nodeConfig: NodeConfig;
  managers: Managers;
};

export type AppStore = {
  get: () => Promise<AppState>;
  unsubscribe: () => void;
  subjects: Record<string, Subject<any>>;
  [k: string]: any;
};
