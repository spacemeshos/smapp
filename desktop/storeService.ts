import path from 'path';
import { app } from 'electron';
import Store from 'electron-store';
import { AccountBalance } from '../shared/types';

interface ConfigStore {
  isAutoStartEnabled: boolean;
  nodeConfigFilePath: string;
  netSettings: {
    netId: number;
    netName: string;
    explorerUrl: string;
    dashUrl: string;
    minCommitmentSize: number;
    layerDurationSec: number;
    genesisTime: string;
  };
  nodeSettings: {
    port: string;
  };
  accounts: Record<
    string,
    {
      publicKey: string;
      account: AccountBalance;
      txs: { [txId: string]: any }; // TODO: Implement within #766
      rewards: { [rewardId: string]: any }; // TODO: Implement within #766
    }
  >;
}

const CONFIG_STORE_DEFAULTS = {
  isAutoStartEnabled: false,
  nodeConfigFilePath: path.resolve(app.getPath('userData'), 'node-config.json'),
  netSettings: {
    netId: -1,
    netName: 'Unknown',
    explorerUrl: '',
    dashUrl: '',
    minCommitmentSize: -1,
    layerDurationSec: -1,
    genesisTime: '',
  },
  nodeSettings: {
    port: '9092',
  },
  accounts: {},
};
class StoreService {
  static store: Store<ConfigStore>;

  static init() {
    if (!StoreService.store) {
      StoreService.store = new Store<ConfigStore>({
        defaults: CONFIG_STORE_DEFAULTS,
      });
    }
  }

  static set = (objectPath: string, property: any) => {
    StoreService.store.set(objectPath, property);
  };

  static get = (key: string) => {
    return StoreService.store.get(key);
  };

  static remove = (key: string) => {
    StoreService.store.delete(key as keyof ConfigStore);
  };

  static clear = () => {
    StoreService.store.clear();
  };
}

export default StoreService;
