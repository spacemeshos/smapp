// @flow
import { Action } from '/types';
import { cryptoService } from '/infra/cryptoService';

export const LOGOUT: string = 'LOGOUT';

export const logout = (): Action => {
  cryptoService.stopAndCleanUp();
  return { type: LOGOUT };
};
