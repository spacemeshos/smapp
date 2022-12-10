import { TxState } from '../../shared/types';
import smColors from './colors';

const getStatusColor = (status: TxState, isSent: boolean) => {
  switch (status) {
    case TxState.MEMPOOL:
    case TxState.MESH:
    case TxState.PROCESSED:
      return smColors.orange;
    case TxState.REJECTED:
    case TxState.INSUFFICIENT_FUNDS:
    case TxState.CONFLICTING:
    case TxState.FAILURE:
    case TxState.INVALID:
      return smColors.red;
    case TxState.SUCCESS:
      return isSent ? smColors.blue : smColors.darkerGreen;
    case TxState.UNSPECIFIED:
    default:
      return smColors.mediumGray;
  }
};

export default getStatusColor;
