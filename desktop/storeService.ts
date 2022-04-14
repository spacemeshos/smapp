import path from 'path';
import Store from 'electron-store';
import { Function, Object, String } from 'ts-toolbelt';
import { AccountBalance } from '../shared/types';
import { Transaction } from '../proto/spacemesh/v1/Transaction';
import { _spacemesh_v1_TransactionState_TransactionState } from '../proto/spacemesh/v1/TransactionState';
import { USERDATA_DIR } from './main/constants';

export type TxStored = Required<Transaction> & { id: string; state: _spacemesh_v1_TransactionState_TransactionState };

export interface AccountStore {
  publicKey: string;
  account: AccountBalance;
  txs: { [txId: TxStored['id']]: TxStored };
  rewards: { [rewardId: TxStored['id']]: TxStored }; // TODO: Implement within #766
}

// TODO: Rewards?

export interface ConfigStore {
  isAutoStartEnabled: boolean;
  node: {
    dataPath: string;
    port: string;
  };
  walletFiles: string[];
}

const CONFIG_STORE_DEFAULTS = {
  isAutoStartEnabled: false,
  node: {
    dataPath: path.resolve(USERDATA_DIR, 'node-data'),
    port: '9092',
  },
  walletFiles: [],
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
