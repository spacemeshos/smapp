import { RootState } from '../../types';

export const getRemoteApi = (state: RootState) => state.wallet.meta.remoteApi;
export const isWalletOnly = (state: RootState) => !!getRemoteApi(state);
