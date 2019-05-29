// @flow
import { Action } from '/types';
import { localStorageService } from '/infra/storageServices';
// import { cryptoService } from '/infra/cryptoService';

export const LOGOUT: string = 'LOGOUT';

export const logout = (): Action => {
  localStorageService.clear();
  // cryptoService.stopAndCleanUp();
  return { type: LOGOUT };
};
