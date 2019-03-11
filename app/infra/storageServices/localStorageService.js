// @flow
class LocalStorageService {
  static saveToLocalStorage(key: string, data: any) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  static getFromLocalStorage(key: string) {
    const storageItem = window.localStorage.getItem(key);
    return storageItem ? JSON.parse(storageItem) : null;
  }

  static removeFromLocalStorage(key: string) {
    window.localStorage.removeItem(key);
  }

  static clearLocalStorage() {
    window.localStorage.clear();
  }
}

export default LocalStorageService;
