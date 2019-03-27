// @flow
import { diskStorageService } from '/infra/diskStorageService';
import { Action, Dispatch } from '/types';

export const SET_ALLOCATION: string = 'SET_ALLOCATION';
export const GET_DRIVES_LIST: string = 'GET_DRIVES_LIST';
export const GET_AVAILABLE_DISK_SPACE: string = 'GET_AVAILABLE_DISK_SPACE';
export const RESET_NODE_SETTINGS: string = 'RESET_NODE_SETTINGS';

const getBytesfromGb = (Gb: number) => Gb * 1073741824;

const getReadableSpace = (spaceInBytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (spaceInBytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(spaceInBytes) / Math.log(1024)));
  return `${Math.round(spaceInBytes / 1024 ** i)} ${sizes[i]}`;
};

const getAllocatedSpaceList = (availableDiskSpace: ?number, increment: number = getBytesfromGb(150)) => {
  const allocatedSpaceList = [];
  if (availableDiskSpace) {
    for (let i = increment; i < availableDiskSpace; i += increment) {
      allocatedSpaceList.push({
        id: i,
        label: getReadableSpace(i)
      });
    }
  }
  return allocatedSpaceList;
};

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
    dispatch({
      type: GET_AVAILABLE_DISK_SPACE,
      payload: { availableDiskSpace: { bytes: availableDiskSpace, readable: getReadableSpace(availableDiskSpace) }, capacities: getAllocatedSpaceList(availableDiskSpace) }
    });
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
