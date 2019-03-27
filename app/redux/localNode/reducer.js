// @flow
import type { Action } from '/types';
import { SET_ALLOCATION, RESET_NODE_SETTINGS, GET_DRIVES_LIST, GET_AVAILABLE_DISK_SPACE } from './actions';

const initialState = {
  capacity: null,
  drives: [],
  availableDiskSpace: null
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
        payload: { availableDiskSpace, capacities }
      } = action;
      return { ...state, availableDiskSpace, capacities };
    }
    case RESET_NODE_SETTINGS:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
