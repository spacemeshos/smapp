// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import {
  SET_ALLOCATION,
  RESET_NODE_SETTINGS,
  GET_DRIVES_LIST,
  GET_AVAILABLE_DISK_SPACE,
  SET_LOCAL_NODE_SETUP_PROGRESS,
  SET_TOTAL_EARNINGS,
  SET_UPCOMING_EARNINGS
} from './actions';

const initialState = {
  drive: null,
  capacity: null,
  drives: [],
  capacityAllocationsList: [],
  availableDiskSpace: null,
  progress: null,
  totalEarnings: null,
  upcomingEarnings: null
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SET_ALLOCATION: {
      const {
        payload: { capacity, drive }
      } = action;
      return { ...state, capacity, drive };
    }
    case GET_DRIVES_LIST: {
      const {
        payload: { drives }
      } = action;
      return { ...state, drives };
    }
    case GET_AVAILABLE_DISK_SPACE: {
      const {
        payload: { availableDiskSpace, capacityAllocationsList }
      } = action;
      return { ...state, availableDiskSpace, capacityAllocationsList };
    }
    case LOGOUT:
    case RESET_NODE_SETTINGS:
      return initialState;
    case SET_LOCAL_NODE_SETUP_PROGRESS: {
      const {
        payload: { progress }
      } = action;
      return { ...state, progress: +progress };
    }
    case SET_TOTAL_EARNINGS: {
      const {
        payload: { totalEarnings }
      } = action;
      return { ...state, totalEarnings };
    }
    case SET_UPCOMING_EARNINGS: {
      const {
        payload: { upcomingEarnings }
      } = action;
      return { ...state, upcomingEarnings };
    }
    default:
      return state;
  }
};

export default reducer;
