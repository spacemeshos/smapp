import { eventsService } from '../../infra/eventsService';
import { createError } from '../../infra/utils';
import { AppThDispatch, CustomAction, GetState, Reward } from '../../types';

export const SET_SMESHER_SETTINGS = 'SET_SMESHER_SETTINGS';
export const STARTED_CREATING_POS_DATA = 'STARTED_CREATING_POS_DATA';
export const DELETED_POS_DATA = 'DELETED_POST_DATA';
export const SET_POST_DATA_CREATION_STATUS = 'SET_POST_DATA_CREATION_STATUS';
export const SET_IS_SMESHING = 'SET_IS_SMESHING';

export const SET_ACCOUNT_REWARDS = 'SET_ACCOUNT_REWARDS';

export const setRewards = ({ rewards }: { rewards: Reward[] }) => ({ type: SET_ACCOUNT_REWARDS, payload: { rewards } });

export const getSmesherSettings = () => async (dispatch: AppThDispatch) => {
  const { error, coinbase, dataDir } = await eventsService.getSmesherSettings();
  if (error) {
    console.error(error); // eslint-disable-line no-console
    dispatch(getSmesherSettings());
  } else {
    dispatch({ type: SET_SMESHER_SETTINGS, payload: { coinbase, dataDir } });
  }
};
// notificationsService.notify({
//         title: 'Spacemesh',
//         notification: 'Your Smesher setup is complete! You are now participating in the Spacemesh network!',
//         callback: () => this.handleNavigation({ index: 0 })
//       });
export const isSmeshing = () => async (dispatch: AppThDispatch) => {
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

// eslint-disable-next-line @typescript-eslint/naming-convention
const _setPostStatus = ({ error, status }: { error: any; status: any }): CustomAction => {
  const { filesStatus, bytesWritten, errorMessage, errorType } = status;
  if (error) {
    console.error(error); // eslint-disable-line no-console
    return { type: SET_POST_DATA_CREATION_STATUS, payload: { error } };
  } else {
    return { type: SET_POST_DATA_CREATION_STATUS, payload: { filesStatus, bytesWritten, errorMessage, errorType } };
  }
};

export const getPostStatus = () => async (dispatch: AppThDispatch) => {
  const { error, status } = await eventsService.getPostStatus();
  dispatch(_setPostStatus({ error, status }));
};

export const createPosData = ({
  coinbase,
  dataDir,
  commitmentSize,
  append = false,
  throttle,
  providerId
}: {
  coinbase: string;
  dataDir: string;
  commitmentSize: number;
  append?: boolean;
  throttle: boolean;
  providerId: number;
}) => async (dispatch: AppThDispatch) => {
  const { error } = await eventsService.createPosData({ coinbase, dataDir, commitmentSize, append, throttle, providerId });
  if (error) {
    throw createError(`Error initiating smeshing: ${error}`, () => dispatch(createPosData({ coinbase, dataDir, commitmentSize, append, throttle, providerId })));
  } else {
    localStorage.setItem('smesherInitTimestamp', `${new Date().getTime()}`);
    localStorage.removeItem('smesherSmeshingTimestamp');
    dispatch({ type: STARTED_CREATING_POS_DATA, payload: { coinbase, commitmentSize, throttle, providerId } });
  }
};

export const deletePosData = () => async (dispatch: AppThDispatch, getState: GetState) => {
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

// ipcRenderer.on(ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS, (_event, request) => {
//   const { error, status } = request;
//   const dispatch = useDispatch();
//   dispatch(_setPostStatus({ error, status }));
// });
