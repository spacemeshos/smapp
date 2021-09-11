import { RootState } from '../../types';

// eslint-disable-next-line import/prefer-default-export
export const isWalletOnly = (state: RootState) => state.wallet.usingRemoteApi;
