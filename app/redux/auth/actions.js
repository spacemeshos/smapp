// @flow
import { Action } from '/types';
import { localStorageService } from '/infra/storageServices';

export const LOGOUT: string = 'LOGOUT';

export const logout = (): Action => {
  localStorageService.clear();
  return { type: LOGOUT };
};
