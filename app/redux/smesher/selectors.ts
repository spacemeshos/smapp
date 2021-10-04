import { PostSetupState } from '../../../shared/types';
import { RootState } from '../../types';

export const getPostSetupState = (state: RootState) => state.smesher.postSetupState;

export const isSmeshing = (state: RootState) => getPostSetupState(state) === PostSetupState.STATE_COMPLETE;
export const isCreatingPostData = (state: RootState) => getPostSetupState(state) === PostSetupState.STATE_IN_PROGRESS;
