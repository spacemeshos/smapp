// @flow
import { addTransaction } from '/redux/wallet/actions';
import { httpService } from '/infra/httpService';
import { localStorageService } from '/infra/storageService';
import { nodeService } from '/infra/nodeService';
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
    const status = await httpService.getNodeStatus();
    dispatch({ type: SET_NODE_STATUS, payload: { status } });
    return status;
  } catch (err) {
    dispatch({ type: SET_NODE_STATUS, payload: { status: null } });
    return null;
  }
};

export const getNodeSettings = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const { address, genesisTime, networkId, commitmentSize, layerDuration } = await nodeService.getNodeSettings();
    dispatch({ type: SET_NODE_SETTINGS, payload: { address, genesisTime, networkId, commitmentSize, layerDuration } });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
};

export const getMiningStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const status = await httpService.getMiningStatus();
    if (status === nodeConsts.IS_MINING) {
      if (!localStorageService.get('smesherSmeshingTimestamp')) {
        localStorageService.set('smesherSmeshingTimestamp', new Date().getTime());
      }
    } else if (status === nodeConsts.NOT_MINING) {
      localStorageService.clearByKey('playedAudio');
      localStorageService.clearByKey('smesherInitTimestamp');
      localStorageService.clearByKey('smesherSmeshingTimestamp');
      localStorageService.clearByKey('rewards');
    }
    dispatch({ type: SET_MINING_STATUS, payload: { status } });
    return status;
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    return 1;
  }
};

export const initMining = ({ logicalDrive, commitmentSize, address }: { logicalDrive: string, commitmentSize: number, address: string }): Action => async (
  dispatch: Dispatch
): Dispatch => {
  try {
    await httpService.initMining({ logicalDrive, commitmentSize, coinbase: address });
    localStorageService.set('smesherInitTimestamp', new Date().getTime());
    localStorageService.clearByKey('smesherSmeshingTimestamp');
    localStorageService.clearByKey('rewards');
    dispatch({ type: INIT_MINING, payload: { address } });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    throw createError(`Error initiating smeshing: ${err}`);
  }
};

export const getUpcomingRewards = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const awardLayerNumbers = await httpService.getUpcomingRewards();
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
    await httpService.setNodeIpAddress({ nodeIpAddress });
    dispatch({ type: SET_NODE_IP, payload: { nodeIpAddress } });
  } catch (err) {
    throw createError('Error setting node IP address', () => setNodeIpAddress({ nodeIpAddress }));
  }
};

export const setRewardsAddress = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.setRewardsAddress({ address });
    dispatch({ type: SET_REWARDS_ADDRESS, payload: { address } });
  } catch (err) {
    throw createError('Error setting rewards address', () => setRewardsAddress({ address }));
  }
};

export const getAccountRewards = ({ notify }: { notify: () => void }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const { accounts, currentAccountIndex } = getState().wallet;
    const rewards = await httpService.getAccountRewards({ address: accounts[currentAccountIndex].publicKey });
    const prevRewards = localStorageService.get('rewards') || [];
    if (prevRewards.length < rewards.length) {
      notify();
      const newRewards = [...rewards.slice(prevRewards.length)];
      newRewards.forEach((reward) => {
        const tx = {
          txId: 'reward',
          sender: null,
          receiver: getAddress(accounts[currentAccountIndex].publicKey),
          amount: reward.totalReward,
          fee: reward.totalReward - reward.layerRewardEstimate,
          status: TX_STATUSES.CONFIRMED,
          layerId: reward.layer,
          timestamp: reward.timestamp
        };
        dispatch(addTransaction({ tx, accountPK: accounts[currentAccountIndex].publicKey }));
      });
      localStorageService.set('rewards', rewards);
      dispatch({ type: SET_ACCOUNT_REWARDS, payload: { rewards } });
    }
  } catch (err) {
    throw createError('Error getting account rewards', () => getAccountRewards({ notify }));
  }
};
