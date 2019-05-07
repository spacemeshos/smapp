// @flow
import { httpService } from '/infra/httpService';
import { Action, Dispatch } from '/types';

export const CHECK_NETWORK_CONNECTION: string = 'CHECK_NETWORK_CONNECTION';
export const SET_NODE_IP: string = 'SET_NODE_IP';

export const checkNetworkConnection = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.checkNetworkConnection();
    dispatch({ type: CHECK_NETWORK_CONNECTION, payload: { isConnected: true } });
  } catch (err) {
    dispatch({ type: CHECK_NETWORK_CONNECTION, payload: { isConnected: false } });
    throw err;
  }
};

export const setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.setNodeIpAddress({ nodeIpAddress });
    dispatch({ type: SET_NODE_IP, payload: { nodeIpAddress } });
  } catch (err) {
    throw err;
  }
};
