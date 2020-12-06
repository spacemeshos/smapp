import { eventsService } from '../../infra/eventsService';
import { createError } from '../../infra/utils';
import { smColors } from '../../vars';
import { AppThDispatch, Status } from '../../types';

export const SET_NODE_STATUS = 'SET_NODE_STATUS';
export const SET_NODE_SETTINGS = 'SET_NODE_SETTINGS';
export const SET_NODE_IP = 'SET_NODE_IP';

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
  const { error, stateRootHash, port } = await eventsService.getNodeSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getNodeSettings());
  } else {
    dispatch({ type: SET_NODE_SETTINGS, payload: { stateRootHash, port } });
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
