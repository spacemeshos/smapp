import path from 'path';
import { app } from 'electron';
import Store from 'electron-store';
import { Function, Object, String } from 'ts-toolbelt';
import { AccountBalance } from '../shared/types';

export interface ConfigStore {
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
    grpcAPI: string[];
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
    grpcAPI: [],
  },
  nodeSettings: {
    port: '9092',
  },
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

  static set = <O extends ConfigStore, P extends string>(key: Function.AutoPath<O, P>, property: Object.Path<O, String.Split<P, '.'>>) => {
    StoreService.store.set(key, property);
  };

  static get = <O extends ConfigStore, P extends string>(key: Function.AutoPath<O, P>): Object.Path<O, String.Split<P, '.'>> => {
    return StoreService.store.get(key);
  };

  static remove = <O extends ConfigStore, P extends string>(key: Function.AutoPath<O, P>) => {
    StoreService.store.delete(key as keyof ConfigStore); // kludge to workaround StoreService types
  };

  static clear = () => {
    StoreService.store.clear();
  };
}

export default StoreService;
