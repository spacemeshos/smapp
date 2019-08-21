// @flow
import { httpService } from '/infra/httpService';
import { createError } from '/infra/utils';
import { Action, Dispatch } from '/types';

export const INIT_MINING: string = 'INIT_MINING';
export const GET_TOTAL_AWARDS: string = 'GET_TOTAL_AWARDS';
export const SET_UPCOMING_EARNINGS: string = 'SET_UPCOMING_EARNINGS';
export const SET_AWARDS_ADDRESS: string = 'SET_AWARDS_ADDRESS';

export const CHECK_NODE_CONNECTION: string = 'CHECK_NODE_CONNECTION';
export const SET_NODE_IP: string = 'SET_NODE_IP';

export const initMining = ({ capacity, drive, address }: { capacity: { id: number, label: string }, drive: { id: number, label: string }, address: string }): Action => async (
  dispatch: Dispatch
): Dispatch => {
  try {
    const commitmentSize = Math.floor(capacity.id / 1048576); // Bytes to MB
    const logicalDrive = drive.label;
    await httpService.initMining({ logicalDrive, commitmentSize, address });
    dispatch({ type: INIT_MINING, payload: { capacity, drive, address } });
  } catch (err) {
    throw createError('Error setting node storage', () => initMining({ capacity, drive, address }));
  }
};

export const getTotalAwards = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const totalEarnings = await httpService.getTotalAwards();
    dispatch({ type: GET_TOTAL_AWARDS, payload: { totalEarnings } });
  } catch (err) {
    throw createError('Error retrieving total rewards', getTotalAwards);
  }
};

export const getUpcomingAward = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const timeTillNextReward = await httpService.getUpcomingAward();
    dispatch({ type: SET_UPCOMING_EARNINGS, payload: { timeTillNextReward } });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};

export const setAwardsAddress = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.setAwardsAddress({ address });
    dispatch({ type: SET_AWARDS_ADDRESS, payload: { address } });
  } catch (err) {
    throw createError('Error setting awards address', () => setAwardsAddress({ address }));
  }
};

export const checkNodeConnection = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.checkNodeConnection();
    dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: true } });
  } catch (err) {
    dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: false } });
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
