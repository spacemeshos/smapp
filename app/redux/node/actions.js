// @flow
import { Action, Dispatch } from '/types';

export const CHECK_NODE_CONNECTION: string = 'CHECK_NODE_CONNECTION';

export const SET_MINING_STATUS: string = 'SET_MINING_STATUS';
export const INIT_MINING: string = 'INIT_MINING';

export const SET_GENESIS_TIME: string = 'SET_GENESIS_TIME';
export const SET_TOTAL_AWARDS: string = 'SET_TOTAL_AWARDS';
export const SET_UPCOMING_REWARDS: string = 'SET_UPCOMING_REWARDS';

export const SET_NODE_IP: string = 'SET_NODE_IP';
export const SET_REWARDS_ADDRESS: string = 'SET_REWARDS_ADDRESS';

// ************************ Mock Util Functions ********************************

const simulateTimedResponse = (upperLimitInSec?: number) => {
  const seconds = upperLimitInSec || 1;
  return new Promise((resolve: Function) => {
    const timeToWait = Math.floor(Math.random() * Math.floor(seconds * 1000));
    setTimeout(() => {
      resolve();
    }, timeToWait);
  });
};

const _getMiningStatus = async (status?: number) => {
  await simulateTimedResponse();
  // 1 = not mining, 2 = in setup, 3 = is mining
  return status || Math.floor(Math.random() * Math.floor(3)) + 1;
};

// ***************************************************************************

export const checkNodeConnection = (): Action => async (dispatch: Dispatch): Dispatch => {
  await simulateTimedResponse(0.1);
  dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: true } });
  return true;
};

export const getMiningStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  await simulateTimedResponse(0.1);
  dispatch({ type: SET_MINING_STATUS, payload: { status: _getMiningStatus() } });
};

export const initMining = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  await simulateTimedResponse();
  dispatch({ type: INIT_MINING, payload: { address } });
};

export const setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }): Action => (dispatch: Dispatch): Dispatch => {
  dispatch({ type: SET_NODE_IP, payload: { nodeIpAddress } });
};

export const setRewardsAddress = ({ address }: { address: string }): Action => (dispatch: Dispatch): Dispatch => {
  dispatch({ type: SET_REWARDS_ADDRESS, payload: { address } });
};
