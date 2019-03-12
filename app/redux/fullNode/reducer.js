// @flow
import type { Action } from '/redux/types';
import { SET_CAPACITY, RESET_NODE_SETTINGS } from './actions';

const initialState = {
  capacity: null
};

const reducer = (state: any = initialState, action: Action) => {
  // eslint-disable-next-line no-console
  console.warn('FULL NODE REDUCER');
  switch (action.type) {
    case SET_CAPACITY: {
      const {
        payload: { capacity }
      } = action;
      // eslint-disable-next-line no-console
      console.log('capacity', capacity, 'action', action);
      return { ...state, capacity };
    }
    case RESET_NODE_SETTINGS:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
