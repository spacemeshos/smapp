// @flow
import { Action } from '/types';
import { localStorageService } from '/infra/storageService';
import { cryptoService } from '/infra/cryptoService';

export const LOGOUT: string = 'LOGOUT';

export const logout = (): Action => {
  localStorageService.clearByKey('hasBackup');
  localStorageService.clearByKey('lastBackupTime');
  cryptoService.stopAndCleanUp();
  return { type: LOGOUT };
};
