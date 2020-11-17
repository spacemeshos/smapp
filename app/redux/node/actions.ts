import { eventsService } from '../../infra/eventsService';
import { createError } from '../../infra/utils';
import { nodeConsts, smColors } from '../../vars';
import { SET_TRANSACTIONS } from '../wallet/actions';
import { AppThDispatch, GetState, Status } from '../../types';

export const SET_NODE_STATUS = 'SET_NODE_STATUS';

export const SET_NODE_SETTINGS = 'SET_NODE_SETTINGS';

export const SET_MINING_STATUS = 'SET_MINING_STATUS';
export const INIT_MINING = 'INIT_MINING';

export const SET_ACCOUNT_REWARDS = 'SET_ACCOUNT_REWARDS';

export const SET_NODE_IP = 'SET_NODE_IP';
export const SET_REWARDS_ADDRESS = 'SET_REWARDS_ADDRESS';

let startUpDelay = 5;
let noPeersCounter = 0;

const makeErrorNodeIndicator = () => {
  if (startUpDelay === 10) {
    return {
      color: smColors.red,
      message: 'Offline. Please quit and start the app again.',
      statusText: 'sync stopped',
      hasError: true
    };
  }
  startUpDelay += 1;
  return {
    color: smColors.orange,
    message: 'Waiting for smesher response...',
    statusText: 'syncing',
    hasError: true
  };
};

const makeNodeIndicator = (status: Status) => {
  if (!status.peers) {
    if (noPeersCounter === 15) {
      return {
        color: smColors.red,
        message: "Can't connect to the p2p network.",
        statusText: 'sync stopped',
        hasError: false
      };
    } else {
      noPeersCounter += 1;
      return {
        color: smColors.orange,
        message: 'Connecting to the p2p network...',
        statusText: 'syncing',
        hasError: false
      };
    }
  } else if (!status.synced) {
    noPeersCounter = 0;
    return {
      color: smColors.orange,
      message: `Syncing the mesh... Layer ${status.syncedLayer || 0} / ${status.currentLayer}`,
      statusText: 'syncing',
      hasError: false
    };
  } else {
    noPeersCounter = 0;
    return {
      color: smColors.green,
      message: `Synced with the mesh. Current layer ${status.currentLayer}. Verified layer ${status.verifiedLayer}`,
      statusText: 'synced',
      hasError: false
    };
  }
};

export const getNodeStatus = () => async (dispatch: AppThDispatch) => {
  const { error, status } = await eventsService.getNodeStatus();
  if (error) {
    const nodeIndicator = makeErrorNodeIndicator();
    dispatch({ type: SET_NODE_STATUS, payload: { status: { noConnection: true }, nodeIndicator } });
    return null;
  } else {
    const nodeIndicator = makeNodeIndicator(status);
    dispatch({ type: SET_NODE_STATUS, payload: { status, nodeIndicator } });
    return status;
  }
};

export const getNodeSettings = () => async (dispatch: AppThDispatch) => {
  const { error, address, posDataPath, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port } = await eventsService.getNodeSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getNodeSettings());
  } else {
    dispatch({ type: SET_NODE_SETTINGS, payload: { address, posDataPath, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port } });
  }
};

export const getMiningStatus = () => async (dispatch: AppThDispatch) => {
  const { error, status } = await eventsService.getMiningStatus();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return nodeConsts.MINING_UNSET;
  } else if (status === nodeConsts.IS_MINING) {
    if (!localStorage.getItem('smesherSmeshingTimestamp')) {
      localStorage.setItem('smesherSmeshingTimestamp', `${new Date().getTime()}`);
    }
  } else if (status === nodeConsts.NOT_MINING) {
    localStorage.removeItem('smesherInitTimestamp');
    localStorage.removeItem('smesherSmeshingTimestamp');
  }
  dispatch({ type: SET_MINING_STATUS, payload: { status } });
  return status;
};

export const initMining = ({
  logicalDrive,
  commitment,
  address,
  processor,
  isPausedOnUsage
}: {
  logicalDrive: string;
  commitment: number;
  address: string;
  processor: any;
  isPausedOnUsage: boolean;
}) => async (dispatch: AppThDispatch) => {
  const { error } = await eventsService.initMining({ logicalDrive, commitment, coinbase: address, processor, isPausedOnUsage });
  if (error) {
    console.error(error); // eslint-disable-line no-console
    throw createError(`Error initiating smeshing: ${error}`, () => dispatch(initMining({ logicalDrive, commitment, address, processor, isPausedOnUsage })));
  } else {
    localStorage.setItem('smesherInitTimestamp', `${new Date().getTime()}`);
    localStorage.removeItem('smesherSmeshingTimestamp');
    dispatch({ type: INIT_MINING, payload: { address } });
  }
};

export const setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }) => async (dispatch: AppThDispatch) => {
  const { error } = await eventsService.setNodeIpAddress({ nodeIpAddress });
  if (error) {
    throw createError('Error setting node IP address', () => dispatch(setNodeIpAddress({ nodeIpAddress })));
  } else {
    dispatch({ type: SET_NODE_IP, payload: { nodeIpAddress } });
  }
};

export const setRewardsAddress = () => async (dispatch: AppThDispatch, getState: GetState) => {
  const { accounts, currentAccountIndex } = getState().wallet;
  const address = accounts[currentAccountIndex].publicKey;
  const { error } = await eventsService.setRewardsAddress({ address });
  if (error) {
    throw createError('Error setting rewards address', () => dispatch(setRewardsAddress()));
  } else {
    dispatch({ type: SET_REWARDS_ADDRESS, payload: { address } });
  }
};

export const getAccountRewards = ({ newRewardsNotifier }: { newRewardsNotifier: () => void }) => async (dispatch: AppThDispatch, getState: GetState) => {
  const { rewardsAddress } = getState().node;
  const { accounts } = getState().wallet;
  const accountIndex = accounts.findIndex((account) => account.publicKey === rewardsAddress);
  const { error, hasNewAwards, rewards, transactions } = await eventsService.getAccountRewards({ address: rewardsAddress, accountIndex });
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
