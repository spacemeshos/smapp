import { nativeTheme } from 'electron';
import Store from 'electron-store';
import { TypedSchemaStore } from '../shared/types';

class StoreService {
  public static store: Store<TypedSchemaStore>;

  constructor() {
    if (!StoreService.store) {
      StoreService.store = new Store<TypedSchemaStore>({
        accessPropertiesByDotNotation: true,
        defaults: {
          accounts: {},
          userSettings: {
            isDarkMode: nativeTheme.shouldUseDarkColors
          },
          isAutoStartEnabled: false,
          localNode: true,
          netSettings: undefined
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

  static remove = ({ key }: { key: keyof TypedSchemaStore }) => {
    StoreService.store.delete(key);
  };

  static clear = () => {
    StoreService.store.clear();
  };
}

export default StoreService;
