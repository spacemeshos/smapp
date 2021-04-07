const Store = require('electron-store');

// data schema:
//
//

class StoreService {
  static store: typeof Store;

  static init() {
    if (!StoreService.store) {
      StoreService.store = new Store();
    }
  }

  static set = (object: any) => {
    StoreService.store.set(object);
  };

  static get = (key: string) => {
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
