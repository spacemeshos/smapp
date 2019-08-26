// @flow
import { httpService } from '/infra/httpService';
import { createError } from '/infra/utils';
import { Action, Dispatch } from '/types';

export const CHECK_NODE_CONNECTION: string = 'CHECK_NODE_CONNECTION';

export const SET_MINING_STATUS: string = 'SET_MINING_STATUS';
export const INIT_MINING: string = 'INIT_MINING';

export const SET_GENESIS_TIME: string = 'SET_GENESIS_TIME';
export const SET_TOTAL_AWARDS: string = 'SET_TOTAL_AWARDS';
export const SET_UPCOMING_REWARDS: string = 'SET_UPCOMING_REWARDS';

export const SET_NODE_IP: string = 'SET_NODE_IP';
export const SET_AWARDS_ADDRESS: string = 'SET_AWARDS_ADDRESS';

export const checkNodeConnection = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.checkNodeConnection();
    dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: true } });
  } catch (err) {
    dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: false } });
    throw err;
  }
};

export const getMiningStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const status = await httpService.getMiningStatus();
    dispatch({ type: SET_MINING_STATUS, payload: { status } });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
};

export const initMining = ({ capacity, drive, address }: { capacity: { id: number, label: string }, drive: { mountPoint: string }, address: string }): Action => async (
  dispatch: Dispatch
): Dispatch => {
  try {
    await httpService.initMining({ logicalDrive: drive.mountPoint, commitmentSize: capacity.id, address });
    dispatch({ type: INIT_MINING, payload: { address } });
  } catch (err) {
    throw createError('Error setting node storage', () => initMining({ capacity, drive, address }));
  }
};

export const getGenesisTime = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const genesisTime = await httpService.getGenesisTime();
    dispatch({ type: SET_GENESIS_TIME, payload: { genesisTime } });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};

export const getUpcomingRewards = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const timeTillNextReward = await httpService.getUpcomingRewards();
    dispatch({ type: SET_UPCOMING_REWARDS, payload: { timeTillNextReward } });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
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

export const setAwardsAddress = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.setAwardsAddress({ address });
    dispatch({ type: SET_AWARDS_ADDRESS, payload: { address } });
  } catch (err) {
    throw createError('Error setting awards address', () => setAwardsAddress({ address }));
  }
};
