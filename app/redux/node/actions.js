// @flow
import { addTransaction } from '/redux/wallet/actions';
import { httpService } from '/infra/httpService';
import { localStorageService } from '/infra/storageService';
import { createError, getAddress } from '/infra/utils';
import { nodeConsts } from '/vars';
import TX_STATUSES from '/vars/enums';
import { Action, Dispatch, GetState } from '/types';

export const CHECK_NODE_CONNECTION: string = 'CHECK_NODE_CONNECTION';

export const SET_MINING_STATUS: string = 'SET_MINING_STATUS';
export const INIT_MINING: string = 'INIT_MINING';

export const SET_GENESIS_TIME: string = 'SET_GENESIS_TIME';
export const SET_UPCOMING_REWARDS: string = 'SET_UPCOMING_REWARDS';
export const SET_ACCOUNT_REWARDS: string = 'SET_ACCOUNT_REWARDS';

export const SET_NODE_IP: string = 'SET_NODE_IP';
export const SET_REWARDS_ADDRESS: string = 'SET_REWARDS_ADDRESS';

export const checkNodeConnection = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.checkNodeConnection();
    dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: true } });
    return true;
  } catch (err) {
    dispatch({ type: CHECK_NODE_CONNECTION, payload: { isConnected: false } });
    return false;
  }
};

export const getMiningStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const status = await httpService.getMiningStatus();
    if (status === nodeConsts.IS_MINING) {
      dispatch(getGenesisTime());
      if (!localStorageService.get('smesherSmeshingTimestamp')) {
        localStorageService.set('smesherSmeshingTimestamp', new Date().getTime());
      }
    } else if (status === nodeConsts.NOT_MINING) {
      localStorageService.clearByKey('smesherInitTimestamp');
      localStorageService.clearByKey('smesherSmeshingTimestamp');
      localStorageService.clearByKey('rewards');
    }
    dispatch({ type: SET_MINING_STATUS, payload: { status } });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
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
    throw createError('Error initiating mining', () => initMining({ logicalDrive, commitmentSize, address }));
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

export const getUpcomingRewards = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const awardLayerNumbers = await httpService.getUpcomingRewards();
    if (awardLayerNumbers.length === 0) {
      dispatch({ type: SET_UPCOMING_REWARDS, payload: { timeTillNextAward: 0 } });
    } else {
      const { genesisTime } = getState().node;
      const currentLayer = Math.floor((new Date().getTime() - new Date(genesisTime).getTime()) / nodeConsts.TIME_BETWEEN_LAYERS);
      const futureAwardLayerNumbers = awardLayerNumbers.filter((layer) => layer > currentLayer);
      dispatch({ type: SET_UPCOMING_REWARDS, payload: { timeTillNextAward: Math.floor((nodeConsts.TIME_BETWEEN_LAYERS * (futureAwardLayerNumbers[0] - currentLayer)) / 6000) } });
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
    throw createError('Error setting awards address', () => setRewardsAddress({ address }));
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
