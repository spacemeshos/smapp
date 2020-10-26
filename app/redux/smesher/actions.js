// @flow
import { ipcRenderer } from 'electron';
import store from '/redux/configureStore';
import { eventsService } from '/infra/eventsService';
import { createError } from '/infra/utils';
import { ipcConsts } from '/vars';
import { Action, Dispatch, GetState } from '/types';

export const SET_SMESHER_SETTINGS = 'SET_SMESHER_SETTINGS';
export const STARTED_CREATING_POS_DATA = 'STARTED_CREATING_POS_DATA';
export const DELETED_POS_DATA = 'DELETED_POST_DATA';
export const SET_POST_DATA_CREATION_STATUS = 'SET_POST_DATA_CREATION_STATUS';
export const SET_IS_SMESHING = 'SET_IS_SMESHING';

export const getSmesherSettings = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, coinbase, dataDir, genesisTime, minCommitmentSize, networkId } = await eventsService.getSmesherSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getSmesherSettings());
  } else {
    dispatch({ type: SET_SMESHER_SETTINGS, payload: { coinbase, dataDir, genesisTime, minCommitmentSize, networkId } });
  }
};
// notificationsService.notify({
//         title: 'Spacemesh',
//         notification: 'Your Smesher setup is complete! You are now participating in the Spacemesh network!',
//         callback: () => this.handleNavigation({ index: 0 })
//       });
export const isSmeshing = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, isSmeshing } = await eventsService.isSmeshing();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(isSmeshing());
  } else {
    if (isSmeshing && !localStorage.getItem('smesherSmeshingTimestamp')) {
      localStorage.setItem('smesherSmeshingTimestamp', `${new Date().getTime()}`);
    } else {
      localStorage.removeItem('playedAudio');
      localStorage.removeItem('smesherInitTimestamp');
      localStorage.removeItem('smesherSmeshingTimestamp');
    }
    dispatch({ type: SET_IS_SMESHING, payload: { isSmeshing } });
  }
};

const _setPostStatus = ({ error, status }): Action => {
  const { filesStatus, bytesWritten, errorMessage, errorType } = status;
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return { type: SET_POST_DATA_CREATION_STATUS, payload: { error } };
  } else {
    return { type: SET_POST_DATA_CREATION_STATUS, payload: { filesStatus, bytesWritten, errorMessage, errorType } };
  }
};

export const getPostStatus = (): Action => async (dispatch: Dispatch): Dispatch => {
  const { error, status } = await eventsService.getPostData();
  dispatch(_setPostStatus({ error, status }));
};

export const createPosData = ({ coinbase, dataDir, commitmentSize, append, throttle, provider }): Action => async (dispatch: Dispatch): Dispatch => {
  const { error } = await eventsService.createPosData({ path: dataDir, commitmentSize, append, throttle, providerId: provider.id });
  if (error) {
    throw createError(`Error initiating smeshing: ${error}`, () => dispatch(createPosData({ coinbase, dataDir, commitmentSize, append, throttle, provider })));
  } else {
    localStorage.setItem('smesherInitTimestamp', `${new Date().getTime()}`);
    localStorage.removeItem('smesherSmeshingTimestamp');
    dispatch({ type: STARTED_CREATING_POS_DATA, payload: { coinbase, commitmentSize, throttle, provider } });
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

ipcRenderer.on(ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS, (event, request) => {
  const { error, status } = request;
  store.dispatch(_setPostStatus({ error, status }));
});
