// @flow
import localStorageService from './localStorageService';

class WalletStorageService {
  saveWallet(data: any) {
    localStorageService.saveToLocalStorage('wallet', data);
  }

  getWallet() {
    return localStorageService.getFromLocalStorage('wallet');
  }

  static removeWalletFromLocalStorage() {
    localStorageService.removeFromLocalStorage('wallet');
  }
}

export default new WalletStorageService();
