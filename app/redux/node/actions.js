// @flow
import { httpService } from '/infra/httpService';
import { createError } from '/infra/utils';
import { nodeConsts } from '/vars';
import { Action, Dispatch, GetState } from '/types';

export const CHECK_NODE_CONNECTION: string = 'CHECK_NODE_CONNECTION';

export const SET_MINING_STATUS: string = 'SET_MINING_STATUS';
export const INIT_MINING: string = 'INIT_MINING';

export const SET_GENESIS_TIME: string = 'SET_GENESIS_TIME';
export const SET_UPCOMING_AWARDS: string = 'SET_UPCOMING_AWARDS';

export const SET_NODE_IP: string = 'SET_NODE_IP';
export const SET_AWARDS_ADDRESS: string = 'SET_AWARDS_ADDRESS';

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
    dispatch({ type: INIT_MINING, payload: { address } });
  } catch (err) {
    throw createError('Error initiating mining', () => initMining({ logicalDrive, commitmentSize, address }));
  }
};

export const getGenesisTime = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const genesisTime = await httpService.getGenesisTime();
    dispatch({ type: SET_GENESIS_TIME, payload: { genesisTime: new Date(genesisTime).getTime() } });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
};

export const getUpcomingAwards = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  try {
    const awardLayerNumbers = await httpService.getUpcomingAwards();
    const { genesisTime } = getState().node;
    const currentLayer = Math.floor((new Date().getTime() - genesisTime) / nodeConsts.TIME_BETWEEN_LAYERS);
    const futureAwardLayerNumbers = awardLayerNumbers.filter((layer) => layer >= currentLayer);
    dispatch({ type: SET_UPCOMING_AWARDS, payload: { timeTillNextAward: nodeConsts.TIME_BETWEEN_LAYERS * (futureAwardLayerNumbers[0] - currentLayer) } });
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

export const setAwardsAddress = ({ address }: { address: string }): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    await httpService.setAwardsAddress({ address });
    dispatch({ type: SET_AWARDS_ADDRESS, payload: { address } });
  } catch (err) {
    throw createError('Error setting awards address', () => setAwardsAddress({ address }));
  }
};
