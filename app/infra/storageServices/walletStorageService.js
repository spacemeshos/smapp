// @flow
import localStorageService from './localStorageService';

class WalletStorageService {
  static saveWalletData(data: Object) {
    localStorageService.saveToLocalStorage('wallet', data);
  }

  static getWalletData() {
    return localStorageService.getFromLocalStorage('wallet');
  }

  static saveWalletFileKey(key: string) {
    localStorageService.saveToLocalStorage('walletKey', key);
  }

  static getWalletFileKey() {
    return localStorageService.getFromLocalStorage('walletKey');
  }

  static clearWalletStorage() {
    localStorageService.removeFromLocalStorage('wallet');
    localStorageService.removeFromLocalStorage('walletKey');
  }
}

export default WalletStorageService;
