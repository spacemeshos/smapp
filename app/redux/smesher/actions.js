// @flow
import { eventsService } from '/infra/eventsService';
import { createError } from '/infra/utils';
import { nodeConsts } from '/vars';
import { Action, Dispatch, GetState } from '/types';

export const SET_SMESHER_SETTINGS = 'SET_SMESHER_SETTINGS';
export const STARTED_CREATING_POS_DATA = 'STARTED_CREATING_POS_DATA';
export const DELETED_POS_DATA = 'DELETED_POST_DATA';

export const getSmesherSettings = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, coinbase, dataDir, genesisTime, minCommitmentSize, networkId } = await eventsService.getSmesherSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getSmesherSettings());
  } else {
    dispatch({ type: SET_SMESHER_SETTINGS, payload: { coinbase, dataDir, genesisTime, minCommitmentSize, networkId } });
  }
};

export const createPosData = ({ path, commitmentSize, append, throttle, providerId }): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, status } = await eventsService.createPosData({ path, commitmentSize, append, throttle, providerId });
  if (error) {
    throw createError(`Error initiating smeshing: ${error}`, () => dispatch(createPosData({ path, commitmentSize, append, throttle, providerId })));
  } else {
    localStorage.setItem('smesherInitTimestamp', `${new Date().getTime()}`);
    localStorage.removeItem('smesherSmeshingTimestamp');
    dispatch({ type: STARTED_CREATING_POS_DATA, payload: { coinbase, commitmentSize,  } });
  }
};

export const deletePosData = (): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
  const { isSmeshing } = getState().smesher;
  let error;
  if (isSmeshing) {
    ({ error } = await eventsService.stopSmeshing({ deleteFiles: true }));
  } else {
    ({ error } = await eventsService.stopCreatingPosData({ deleteFiles: true }));
  }
  if (error) {
    console.error(error); // eslint-disable-line no-console
  } else {
    dispatch({ type: DELETED_POS_DATA });
  }
};
