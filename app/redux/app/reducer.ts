import type { AppState, CustomAction } from '../../types';
import { version } from '../../../package.json';
import { SET_APP_LATEST_VERSION } from './actions';

const initialState = {
  latestVersion: version,
  currentVersion: version
};

const reducer = (state: AppState = initialState, action: CustomAction) => {
  switch (action.type) {
    case SET_APP_LATEST_VERSION: {
      const { version } = action.payload;
      return {
        ...state,
        latestVersion: version
      };
    }
    default:
      return state;
  }
};

export default reducer;
