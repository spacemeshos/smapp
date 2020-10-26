// @flow
import { eventsService } from '/infra/eventsService';
import { createError } from '/infra/utils';
import { Action, Dispatch, GetState } from '/types';
import { SET_TRANSACTIONS } from '/redux/wallet/actions';

export const SET_NODE_STATUS: string = 'SET_NODE_STATUS';

export const SET_NODE_SETTINGS: string = 'SET_NODE_SETTINGS';

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
  const { error, stateRootHash, port } = await eventsService.getNodeSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getNodeSettings());
  } else {
    dispatch({ type: SET_NODE_SETTINGS, payload: { stateRootHash, port } });
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

export const setRewardsAddress = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { accounts, currentAccountIndex } = getState().wallet;
  const address = accounts[currentAccountIndex].publicKey;
  const { error } = await eventsService.setRewardsAddress({ address });
  if (error) {
    throw createError('Error setting rewards address', () => dispatch(setRewardsAddress()));
  } else {
    dispatch({ type: SET_REWARDS_ADDRESS, payload: { address } });
  }
};

export const getAccountRewards = ({ newRewardsNotifier }: { newRewardsNotifier: () => void }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { coinbase } = getState().node;
  const { accounts } = getState().wallet;
  const accountIndex = accounts.findIndex((account) => account.publicKey === coinbase);
  const { error, hasNewAwards, rewards, transactions } = await eventsService.getAccountRewards({ address: coinbase, accountIndex });
  if (error) {
    console.error(error); // eslint-disable-line no-console
  } else {
    dispatch({ type: SET_ACCOUNT_REWARDS, payload: { rewards } });
    if (transactions) {
      dispatch({ type: SET_TRANSACTIONS, payload: { transactions } });
    }
    if (hasNewAwards) {
      newRewardsNotifier();
    }
  }
};
