// @flow
import { diskStorageService } from '/infra/diskStorageService';
import { Action, Dispatch } from '/types';

export const SET_ALLOCATION: string = 'SET_ALLOCATION';
export const GET_DRIVES_LIST: string = 'GET_DRIVES_LIST';
export const GET_AVAILABLE_DISK_SPACE: string = 'GET_AVAILABLE_DISK_SPACE';
export const RESET_NODE_SETTINGS: string = 'RESET_NODE_SETTINGS';

export const setLocalNodeStorage = ({ capacity, drive }: { capacity: ?number, drive: ?string }) => {
  return { type: SET_ALLOCATION, payload: { capacity, drive } };
};

export const getDrivesList = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const drives = await diskStorageService.getDriveList();
    dispatch({ type: GET_DRIVES_LIST, payload: { drives } });
  } catch (err) {
    dispatch({ type: GET_DRIVES_LIST, payload: { drives: [] } });
    throw err;
  }
};

export const getAvailableSpace = (path: string): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const availableDiskSpace = await diskStorageService.getAvailableDiskSpace({ path });
    dispatch({ type: GET_AVAILABLE_DISK_SPACE, payload: { availableDiskSpace } });
  } catch (err) {
    dispatch({ type: GET_AVAILABLE_DISK_SPACE, payload: { availableDiskSpace: null } });
    throw err;
  }
};

export const resetNodeSettings = () => {
  return {
    type: RESET_NODE_SETTINGS
  };
};
