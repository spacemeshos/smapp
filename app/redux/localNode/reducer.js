// @flow
import type { Action } from '/types';
import { LOGOUT } from '/redux/auth/actions';
import { SET_ALLOCATION, RESET_NODE_SETTINGS, GET_DRIVES_LIST, SET_LOCAL_NODE_SETUP_PROGRESS, SET_TOTAL_EARNINGS, SET_UPCOMING_EARNINGS, SET_AWARDS_ADDRESS } from './actions';

const initialState = {
  drive: null,
  capacity: null,
  drives: [],
  progress: null,
  totalEarnings: null,
  upcomingEarnings: null,
  awardsAddress: null
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
    case SET_AWARDS_ADDRESS: {
      const {
        payload: { awardsAddress }
      } = action;
      return { ...state, awardsAddress };
    }
    default:
      return state;
  }
};

export default reducer;
