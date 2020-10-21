// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { nodeConsts, smColors } from '/vars';
import { SET_MINING_STATUS, SET_NODE_SETTINGS, INIT_MINING, SET_UPCOMING_REWARDS, SET_REWARDS_ADDRESS, SET_NODE_IP, SET_NODE_STATUS, SET_ACCOUNT_REWARDS } from './actions';

const initialState = {
  status: null,
  nodeIndicator: null,
  miningStatus: nodeConsts.MINING_UNSET,
  rewardsAddress: null,
  genesisTime: 0,
  networkId: 0,
  commitmentSize: 0,
  layerDuration: 0,
  stateRootHash: null,
  port: '',
  rewards: [],
  timeTillNextAward: 0,
  nodeIpAddress: nodeConsts.DEFAULT_URL
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SET_NODE_STATUS: {
      const nodeIndicator = {};

      let startUpDelay = 0;
      let noPeersCounter = 0;

      const nodeStatus = action.payload.status;

      if (nodeStatus.noConnection) {
        startUpDelay += 1;
      }

      if (startUpDelay === 2) {
        nodeIndicator.color = smColors.red;
        nodeIndicator.message = 'Offline. Please quit and start the app again.';
        nodeIndicator.statusText = 'sync stopped';
      } else if (!nodeStatus || nodeStatus.noConnection) {
        nodeIndicator.color = smColors.orange;
        nodeIndicator.message = 'Waiting for smesher response...';
        nodeIndicator.statusText = 'syncing';
      } else if (!nodeStatus.peers) {
        if (noPeersCounter === 15) {
          nodeIndicator.color = smColors.red;
          nodeIndicator.message = "Can't connect to the p2p network.";
          nodeIndicator.statusText = 'sync stopped';
        } else {
          nodeIndicator.color = smColors.orange;
          nodeIndicator.message = 'Connecting to the p2p network...';
          noPeersCounter += 1;
          nodeIndicator.statusText = 'syncing';
        }
      } else if (!nodeStatus.synced) {
        noPeersCounter = 0;
        nodeIndicator.color = smColors.orange;
        nodeIndicator.message = `Syncing the mesh... Layer ${nodeStatus.syncedLayer || 0} / ${nodeStatus.currentLayer}`;
        nodeIndicator.statusText = 'syncing';
      } else {
        noPeersCounter = 0;
        nodeIndicator.color = smColors.blue;
        nodeIndicator.message = `Synced with the mesh. Current layer ${nodeStatus.currentLayer}. Verified layer ${nodeStatus.verifiedLayer}`;
        nodeIndicator.statusText = 'synced';
      }

      const {
        payload: { status }
      } = action;

      return { ...state, status, nodeIndicator };
    }
    case SET_NODE_SETTINGS: {
      const {
        payload: { address, posDataPath, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port }
      } = action;
      return { ...state, rewardsAddress: address, posDataPath, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash, port };
    }
    case SET_MINING_STATUS: {
      const {
        payload: { status }
      } = action;
      return { ...state, miningStatus: status };
    }
    case INIT_MINING: {
      const {
        payload: { address }
      } = action;
      return { ...state, rewardsAddress: address, miningStatus: nodeConsts.IN_SETUP };
    }
    case SET_UPCOMING_REWARDS: {
      const {
        payload: { timeTillNextAward }
      } = action;
      return { ...state, timeTillNextAward };
    }
    case SET_REWARDS_ADDRESS: {
      const {
        payload: { address }
      } = action;
      return { ...state, rewardsAddress: address };
    }
    case SET_NODE_IP: {
      const {
        payload: { nodeIpAddress }
      } = action;
      return { ...state, nodeIpAddress };
    }
    case SET_ACCOUNT_REWARDS: {
      const { rewards } = action.payload;
      return { ...state, rewards };
    }
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
