// @flow
export const SET_CAPACITY: string = 'SET_CAPACITY';
export const RESET_NODE_SETTINGS: string = 'RESET_NODE_SETTINGS';

export const setFullNodeStorage = ({ capacity, drive }: { capacity: ?number, drive: ?string }) => (dispatch: Function) => {
  dispatch({ type: SET_CAPACITY, payload: { capacity, drive } });
};

export function resetNodeSettings() {
  return {
    type: RESET_NODE_SETTINGS,
    payload: null
  };
}
