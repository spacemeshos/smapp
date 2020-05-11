// @flow
import { localStorageService } from '/infra/storageService';
import { eventsService } from '/infra/eventsService';
import { createError, getAddress } from '/infra/utils';
import { nodeConsts } from '/vars';
import TX_STATUSES from '/vars/enums';
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
  try {
    const { status } = await eventsService.getNodeStatus();
    dispatch({ type: SET_NODE_STATUS, payload: { status } });
    return status;
  } catch (err) {
    dispatch({ type: SET_NODE_STATUS, payload: { status: { noConnection: true } } });
    return null;
  }
};

export const getNodeSettings = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port } = await eventsService.getNodeSettings();
    dispatch({ type: SET_NODE_SETTINGS, payload: { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port } });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
};

export const getMiningStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const { status } = await eventsService.getMiningStatus();
    if (status === nodeConsts.IS_MINING) {
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
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    return nodeConsts.MINING_UNSET;
  }
};

export const initMining = ({ logicalDrive, commitmentSize, address }: { logicalDrive: string, commitmentSize: number, address: string }): Action => async (
  dispatch: Dispatch
): Dispatch => {
  try {
    await eventsService.initMining({ logicalDrive, commitmentSize, coinbase: address });
    localStorageService.set('smesherInitTimestamp', new Date().getTime());
    localStorageService.clearByKey('smesherSmeshingTimestamp');
    dispatch({ type: INIT_MINING, payload: { address } });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    throw createError(`Error initiating smeshing: ${err}`);
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
  try {
    await eventsService.setNodeIpAddress({ nodeIpAddress });
    dispatch({ type: SET_NODE_IP, payload: { nodeIpAddress } });
  } catch (err) {
    throw createError('Error setting node IP address', () => setNodeIpAddress({ nodeIpAddress }));
  }
};

export const setRewardsAddress = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await eventsService.setRewardsAddress({ address });
    dispatch({ type: SET_REWARDS_ADDRESS, payload: { address } });
  } catch (err) {
    throw createError('Error setting rewards address', () => setRewardsAddress({ address }));
  }
};

export const getAccountRewards = ({ notify }: { notify: () => void }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {

};
