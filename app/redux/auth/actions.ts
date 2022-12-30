import { eventsService } from '../../infra/eventsService';
import { CustomAction } from '../../types';

export const LOGOUT = 'LOGOUT';

export const logout = (): CustomAction => {
  eventsService.closeWallet();
  return { type: LOGOUT };
};
