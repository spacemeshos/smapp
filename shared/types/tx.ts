import { _spacemesh_v1_TransactionState_TransactionState as TState } from '../../api/generated/spacemesh/v1/TransactionState';
import { _spacemesh_v1_TransactionReceipt_TransactionResult as TReceipt } from '../../api/generated/spacemesh/v1/TransactionReceipt';
import { _spacemesh_v1_TransactionResult_Status as TResult } from '../../api/generated/spacemesh/v1/TransactionResult';
import { Bech32Address, HexString } from './misc';

export enum TxState {
  UNSPECIFIED = 0,
  REJECTED = 1,
  INSUFFICIENT_FUNDS = 2,
  CONFLICTING = 3,
  MEMPOOL = 4,
  MESH = 5,
  PROCESSED = 6,
  SUCCESS = 7,
  FAILURE = 8,
  INVALID = 9,
}

export const formatTxState = (txState: TxState) => {
  switch (txState) {
    case TxState.UNSPECIFIED:
    default:
      return 'Unspecified State';
    case TxState.REJECTED:
      return 'Rejected';
    case TxState.CONFLICTING:
      return 'Conflicting';
    case TxState.INSUFFICIENT_FUNDS:
      return 'Insufficient funds';
    case TxState.FAILURE:
      return 'Failure';
    case TxState.INVALID:
      return 'Invalid Transaction';
    case TxState.MEMPOOL:
      return 'In Mempool';
    case TxState.MESH:
      return 'In Mesh';
    case TxState.PROCESSED:
    case TxState.SUCCESS:
      return 'Applied';
  }
};

export const toTxState = (state: TState | TxState, res?: TResult): TxState => {
  if (!state) return TxState.UNSPECIFIED;
  if (typeof res === 'number') return TxState.PROCESSED + 1 + res;
  return state as TxState;
};

// Transactions

interface TxReceipt {
  fee: number;
  result?: TReceipt;
  gasUsed?: number;
  svmData?: HexString;
}

export interface Tx<T = any> {
  id: HexString;
  principal: Bech32Address;
  template: Bech32Address;
  method: number;
  status: TxState;
  payload: T;
  meta?: {
    templateName: string | null;
    methodName: string | null;
  };
  gas: {
    gasPrice: number;
    maxGas: number;
    fee: number;
  };
  layer?: number;
  note?: string;
  // Old one, TODO: Remove
  receipt?: TxReceipt;
}

export const asTx = <T>(tx: Tx<T>): Tx<T> => tx;

export interface TxSendRequest {
  sender: HexString;
  receiver: HexString;
  fee: number;
  amount: number;
  note?: string;
}

// Rewards

export interface Reward {
  coinbase: HexString;
  amount: number;
  layer: number;
  layerReward: number;
  layerComputed?: number; // TODO ?
}

export interface Activation {
  id: Uint8Array;
  smesherId: Uint8Array;
  coinbase: Uint8Array;
  prevAtx?: Uint8Array | null;
  layer: number;
  numUnits: number;
}
