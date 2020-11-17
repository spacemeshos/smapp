const Store = require('electron-store');

class StoreService {
  static store: typeof Store;

  static init() {
    if (!StoreService.store) {
      StoreService.store = new Store();
    }
  }

  static set = ({ key, value }: { key: string; value: any }) => {
    StoreService.store.set(key, value);
  };

  static get = ({ key }: { key: string }) => {
    return StoreService.store.get(key);
  };

  static remove = ({ key }: { key: string }) => {
    StoreService.store.delete(key);
  };

  static clear = () => {
    StoreService.store.clear();
  };
}

export default StoreService;
