import { SocketAddress } from '../shared/types';

const Store = require('electron-store');

class StoreService {
  static store: typeof Store;

  static init() {
    if (!StoreService.store) {
      StoreService.store = new Store();
    }
  }

  static set = (objectPath: string, property: any) => {
    StoreService.store.set(objectPath, property);
  };

  static get = (key: string) => {
    return StoreService.store.get(key);
  };

  static remove = (key: string) => {
    StoreService.store.delete(key);
  };

  static clear = () => {
    StoreService.store.clear();
  };

  //

  static setRemoteApi = (ip: string, port: string) => {
    StoreService.store.set({
      remoteApi: {
        ip,
        port
      }
    });
  };

  static getRemoteApi = (): SocketAddress => {
    const stored = StoreService.store.get('remoteApi');
    return {
      ip: stored?.ip ? stored.ip : '',
      port: stored?.port ? stored.port : ''
    };
  };

  static resetRemoteApi = () => {
    StoreService.remove('remoteApi');
  };
}

export default StoreService;
