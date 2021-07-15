import { RootState } from '../../types';

// eslint-disable-next-line import/prefer-default-export
export const getNodeError = (state: RootState) => state.node.errors.sort((a, b) => b.level - a.level)[0];
