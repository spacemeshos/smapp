// @flow
export const SET_CAPACITY: string = 'SET_CAPACITY';
export const RESET_NODE_SETTINGS: string = 'RESET_NODE_SETTINGS';

export const setLocalNodeStorage = ({ capacity, drive }: { capacity: ?number, drive: ?string }) => {
  return { type: SET_CAPACITY, payload: { capacity, drive } };
};

export const resetNodeSettings = () => {
  return {
    type: RESET_NODE_SETTINGS
  };
};
