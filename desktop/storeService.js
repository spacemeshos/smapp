const Store = require('electron-store');

class StoreService {
  static store;

  static init() {
    if (!StoreService.store) {
      StoreService.store = new Store();
    }
  }

  static set = ({ key, value }) => {
    StoreService.store.set(key, value);
  };

  static get = ({ key }) => {
    return StoreService.store.get(key);
  };

  static remove = ({ key }) => {
    StoreService.store.delete(key);
  };

  static clear = () => {
    StoreService.store.clear();
  };
}

export default StoreService;
