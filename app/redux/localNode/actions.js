// @flow
import { diskStorageService } from '/infra/diskStorageService';
import { httpService } from '/infra/httpService';
import { Action, Dispatch } from '/types';

export const SET_ALLOCATION: string = 'SET_ALLOCATION';
export const GET_DRIVES_LIST: string = 'GET_DRIVES_LIST';
export const GET_AVAILABLE_DISK_SPACE: string = 'GET_AVAILABLE_DISK_SPACE';
export const RESET_NODE_SETTINGS: string = 'RESET_NODE_SETTINGS';
export const GET_LOCAL_NODE_SETUP_PROGRESS: string = 'GET_LOCAL_NODE_SETUP_PROGRESS';
export const GET_TOTAL_EARNINGS: string = 'GET_TOTAL_EARNINGS';
export const GET_UPCOMING_EARNINGS: string = 'GET_UPCOMING_EARNINGS';

const getBytesFromGb = (Gb: number) => Gb * 1073741824;

const getReadableSpace = (spaceInBytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (spaceInBytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(spaceInBytes) / Math.log(1024)));
  return `${Math.round(spaceInBytes / 1024 ** i)} ${sizes[i]}`;
};

const getAllocatedSpaceList = (availableDiskSpace: ?number, increment: number = getBytesFromGb(150)): Action => {
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

export const setLocalNodeStorage = ({ capacity, drive }: { capacity: ?number, drive: ?string }): Action => ({ type: SET_ALLOCATION, payload: { capacity, drive } });

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
      payload: {
        availableDiskSpace: { bytes: availableDiskSpace, readable: getReadableSpace(availableDiskSpace) },
        capacityAllocationsList: getAllocatedSpaceList(availableDiskSpace)
      }
    });
  } catch (err) {
    dispatch({ type: GET_AVAILABLE_DISK_SPACE, payload: { availableDiskSpace: null } });
    throw err;
  }
};

export const resetNodeSettings = (): Action => ({ type: RESET_NODE_SETTINGS });

export const getLocalNodeSetupProgress = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const progress = await httpService.getLocalNodeSetupProgress();
    dispatch({ type: GET_LOCAL_NODE_SETUP_PROGRESS, payload: { progress } });
  } catch (err) {
    dispatch({ type: GET_LOCAL_NODE_SETUP_PROGRESS, payload: { progress: null } });
    throw err;
  }
};

export const getTotalEarnings = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const totalEarnings = await httpService.getTotalEarnings();
    dispatch({ type: GET_TOTAL_EARNINGS, payload: { totalEarnings } });
  } catch (err) {
    dispatch({ type: GET_TOTAL_EARNINGS, payload: { progress: null } });
    throw err;
  }
};

export const getUpcomingEarnings = (): Action => async (dispatch: Dispatch): Dispatch => {
  try {
    const upcomingEarnings = await httpService.getUpcomingEarnings();
    dispatch({ type: GET_UPCOMING_EARNINGS, payload: { upcomingEarnings } });
  } catch (err) {
    dispatch({ type: GET_UPCOMING_EARNINGS, payload: { progress: null } });
    throw err;
  }
};
