// @flow
class LocalStorageService {
  static set(key: string, data: any) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }

  static get(key: string) {
    const storageItem = window.localStorage.getItem(key);
    return storageItem ? JSON.parse(storageItem) : null;
  }

  static clearByKey(key: string) {
    window.localStorage.removeItem(key);
  }

  static clear() {
    window.localStorage.clear();
  }
}

export default LocalStorageService;
