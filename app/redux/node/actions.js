// @flow
import { localStorageService } from '/infra/storageService';
import { eventsService } from '/infra/eventsService';
import { createError } from '/infra/utils';
import { nodeConsts } from '/vars';
import { Action, Dispatch, GetState } from '/types';

export const SET_NODE_STATUS: string = 'SET_NODE_STATUS';

export const SET_NODE_SETTINGS: string = 'SET_NODE_SETTINGS';

export const SET_MINING_STATUS: string = 'SET_MINING_STATUS';
export const INIT_MINING: string = 'INIT_MINING';

export const SET_UPCOMING_REWARDS: string = 'SET_UPCOMING_REWARDS';
export const SET_ACCOUNT_REWARDS: string = 'SET_ACCOUNT_REWARDS';

export const SET_NODE_IP: string = 'SET_NODE_IP';
export const SET_REWARDS_ADDRESS: string = 'SET_REWARDS_ADDRESS';

export const getNodeStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, status } = await eventsService.getNodeStatus();
  if (error) {
    dispatch({ type: SET_NODE_STATUS, payload: { status: { noConnection: true } } });
    return null;
  } else {
    dispatch({ type: SET_NODE_STATUS, payload: { status } });
    return status;
  }
};

export const getNodeSettings = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port } = await eventsService.getNodeSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getNodeSettings());
  } else {
    dispatch({ type: SET_NODE_SETTINGS, payload: { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port } });
  }
};

export const getMiningStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, status } = await eventsService.getMiningStatus();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return nodeConsts.MINING_UNSET;
  } else if (status === nodeConsts.IS_MINING) {
    if (!localStorageService.get('smesherSmeshingTimestamp')) {
      localStorageService.set('smesherSmeshingTimestamp', new Date().getTime());
    }
  } else if (status === nodeConsts.NOT_MINING) {
    localStorageService.clearByKey('playedAudio');
    localStorageService.clearByKey('smesherInitTimestamp');
    localStorageService.clearByKey('smesherSmeshingTimestamp');
  }
  dispatch({ type: SET_MINING_STATUS, payload: { status } });
  return status;
};

export const initMining = ({ logicalDrive, commitmentSize, address }: { logicalDrive: string, commitmentSize: number, address: string }): Action => async (
  dispatch: Dispatch
): Dispatch => {
  const { error } = await eventsService.initMining({ logicalDrive, commitmentSize, coinbase: address });
  if (error) {
    console.error(error); // eslint-disable-line no-console
    throw createError(`Error initiating smeshing: ${error}`, () => dispatch(initMining({ logicalDrive, commitmentSize, address })));
  } else {
    localStorageService.set('smesherInitTimestamp', new Date().getTime());
    localStorageService.clearByKey('smesherSmeshingTimestamp');
    dispatch({ type: INIT_MINING, payload: { address } });
  }
};

export const getUpcomingRewards = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const awardLayerNumbers = await eventsService.getUpcomingRewards();
    if (awardLayerNumbers.length === 0) {
      dispatch({ type: SET_UPCOMING_REWARDS, payload: { timeTillNextAward: 0 } });
    } else {
      const { status, layerDuration } = getState().node;
      const currentLayer = status?.currentLayer || 0;
      const futureAwardLayerNumbers = awardLayerNumbers.filter((layer) => layer > currentLayer);
      if (futureAwardLayerNumbers.length) {
        dispatch({ type: SET_UPCOMING_REWARDS, payload: { timeTillNextAward: Math.floor((layerDuration * (futureAwardLayerNumbers[0] - currentLayer)) / 6000) } });
      }
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};

export const setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }): Action => async (dispatch: Dispatch): Dispatch => {
  const { error } = await eventsService.setNodeIpAddress({ nodeIpAddress });
  if (error) {
    throw createError('Error setting node IP address', () => dispatch(setNodeIpAddress({ nodeIpAddress })));
  } else {
    dispatch({ type: SET_NODE_IP, payload: { nodeIpAddress } });
  }
};

export const setRewardsAddress = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  const { error } = await eventsService.setRewardsAddress({ address });
  if (error) {
    throw createError('Error setting rewards address', () => dispatch(setRewardsAddress({ address })));
  } else {
    dispatch({ type: SET_REWARDS_ADDRESS, payload: { address } });
  }
};

export const getAccountRewards = ({ newRewardsNotifier }: { newRewardsNotifier: () => void }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { rewardsAddress } = getState().node;
  const { currentAccountIndex } = getState().wallet;
  const { error, hasNewAwards, rewards } = await eventsService.getAccountRewards({ address: rewardsAddress, accountIndex: currentAccountIndex });
  if (error) {
    console.error(error); // eslint-disable-line no-console
  } else {
    dispatch({ type: SET_ACCOUNT_REWARDS, payload: rewards });
    if (hasNewAwards) {
      newRewardsNotifier();
    }
  }
};
