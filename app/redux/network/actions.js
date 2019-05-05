// @flow
import { httpService } from '/infra/httpService';
import { Action, Dispatch } from '/types';

export const CHECK_NETWORK_CONNECTION: string = 'CHECK_NETWORK_CONNECTION';

export const checkNetworkConnection = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.checkNetworkConnection();
    dispatch({ type: CHECK_NETWORK_CONNECTION, payload: { isNetworkConnected: true } });
  } catch (err) {
    dispatch({ type: CHECK_NETWORK_CONNECTION, payload: { isNetworkConnected: false } });
    throw err;
  }
};
