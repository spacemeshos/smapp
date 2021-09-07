import Store from 'electron-store';
import { TypedSchemaStore } from '../shared/types';

class StoreService {
  public static store: Store<TypedSchemaStore>;

  static init() {
    if (!StoreService.store) {
      StoreService.store = new Store<TypedSchemaStore>({
        accessPropertiesByDotNotation: true,
        schema: {
          netSettings: {
            type: 'object',
            properties: {}
          },
          accounts: {
            type: 'object',
            properties: {}
          },
          isAutoStartEnabled: {
            type: 'boolean',
            properties: {}
          },
          localNode: {
            type: 'boolean',
            properties: {}
          },
          userSettings: {
            type: 'object',
            properties: {}
          }
        },
        defaults: {
          accounts: {},
          userSettings: {
            darkMode: 'system'
          },
          isAutoStartEnabled: false,
          localNode: true,
          netSettings: {
            netId: 20,
            netName: 'devnet 20',
            explorerUrl: 'https://explorer-20.spacemesh.io/',
            dashUrl: 'https://dash-20.spacemesh.io/',
            minCommitmentSize: 0,
            genesisTime: '2021-07-28T13:06:51+05:30',
            layerDurationSec: 200
          }
        },
        name: 'config',
        migrations: {}
      });
    }
  }

  static set = (objectPath: string, property: any) => {
    StoreService.store.set(objectPath, property);
  };

  static get = (key: string) => {
    return StoreService.store.get(key);
  };

  static remove = (key: any) => {
    StoreService.store.delete(key);
  };

  static clear = () => {
    StoreService.store.clear();
  };
}

export default StoreService;
