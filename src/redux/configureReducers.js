import { combineReducers } from 'redux';
import auth from '/redux/auth/reducer';

// $FlowFixMe
const reduceReducers = (...reducers) => (previous, action) => reducers.reduce((currentState, currentReducer) => currentReducer(currentState, action), previous);

// eslint-disable-next-line no-unused-vars
const configureReducer = ({ initialState }: { initialState: Object }) => {
  // $FlowFixMe
  const appReducer = reduceReducers(
    combineReducers({
      auth
    })
  );

  return appReducer;
};

export default configureReducer;
