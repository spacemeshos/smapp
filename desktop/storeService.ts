import path from 'path';
import Store from 'electron-store';
import { Object } from 'ts-toolbelt';
import { AutoPath } from 'ts-toolbelt/out/Function/AutoPath';
import { Split } from 'ts-toolbelt/out/String/Split';
import { HexString } from '../shared/types';
import { USERDATA_DIR } from './main/constants';
import { SmeshingOpts } from './main/smeshingOpts';

export interface ConfigStore {
  isAutoStartEnabled: boolean;
  node: {
    dataPath: string;
    port: string;
  };
  smeshing: Record<HexString, SmeshingOpts>;
  walletFiles: string[];
}

const CONFIG_STORE_DEFAULTS = {
  isAutoStartEnabled: false,
  node: {
    dataPath: path.resolve(USERDATA_DIR, 'node-data'),
    port: '9092',
  },
  smeshing: {},
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

  static set = <O extends ConfigStore, P extends string>(
    key: AutoPath<O, P>,
    property: Object.Path<O, Split<P, '.'>>
  ) => {
    StoreService.store.set(key, property);
  };

  static get = <O extends ConfigStore, P extends string>(
    key: AutoPath<O, P>
  ): Object.Path<O, Split<P, '.'>> => {
    return StoreService.store.get(key);
  };

  static remove = <O extends ConfigStore, P extends string>(
    key: AutoPath<O, P>
  ) => {
    StoreService.store.delete(key as keyof ConfigStore); // kludge to workaround StoreService types
  };

  static clear = () => {
    StoreService.store.clear();
  };

  static dump = () => StoreService.store.store;

  static onChange = <
    O extends ConfigStore,
    P extends string,
    V extends Object.Path<O, Split<P, '.'>>
  >(
    key: AutoPath<O, P>,
    cb: (newValue?: V, prevValue?: V) => void
  ) => {
    // @ts-ignore
    StoreService.store.onDidChange(key, cb); // TODO!
  };

  static onAnyChange = (
    cb: (newValue?: ConfigStore, prevValue?: ConfigStore) => void
  ) => {
    return StoreService.store.onDidAnyChange(cb);
  };
}

export default StoreService;
