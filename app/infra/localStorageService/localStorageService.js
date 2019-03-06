// @flow
class LocalStorageService {
  static saveToLocalStorage(key: string, data: any) {
      console.log('saving ', data, 'to local storage');
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  static getFromLocalStorage(key: string) {
    const storageItem = window.localStorage.getItem(key);
    return storageItem ? JSON.parse(storageItem) : null;
  }

  static clearLocalStorage() {
    window.localStorage.clear();
  }
}

export default LocalStorageService;
