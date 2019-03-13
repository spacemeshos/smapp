// @flow
import localStorageService from './localStorageService';

class WalletStorageService {
  static addWalletFilePath = ({ filePath }: { filePath: string }) => {
    const data = localStorageService.get('wallet') || {};
    if (!data.files) {
      data.files = [];
    }
    data.files.push(filePath);
    localStorageService.set('wallet', data);
  };

  static getWalletFilesPath = () => {
    const data = localStorageService.get('wallet');
    return data && data.files ? data.files : [];
  };

  static saveFileKey = ({ key }: { key: string }) => {
    const data = localStorageService.get('wallet') || {};
    data.key = key;
    localStorageService.set('wallet', data);
  };

  static getFileKey = () => {
    const data = localStorageService.get('wallet');
    return data ? data.key : null;
  };

  static clear = () => {
    localStorageService.clearByKey('wallet');
  };
}

export default WalletStorageService;
