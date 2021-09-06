import StoreService from '../desktop/storeService';

// eslint-disable-next-line import/prefer-default-export
export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

export const setTheme = (key: string, value: any) => {
  StoreService.init();
  StoreService.set(key, value);
};
