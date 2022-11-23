import { _spacemesh_v1_TransactionState_TransactionState as TxState } from '../../proto/spacemesh/v1/TransactionState';
import { _spacemesh_v1_TransactionReceipt_TransactionResult as TxResult } from '../../proto/spacemesh/v1/TransactionReceipt';
import { Bech32Address, HexString } from './misc';

export { _spacemesh_v1_TransactionState_TransactionState as TxState } from '../../proto/spacemesh/v1/TransactionState';

// Transactions

interface TxReceipt {
  fee: number;
  result?: TxResult;
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

export interface SmesherReward {
  coinbase: string;
  total: number;
  layer: number;
  layerReward: number;
}

export interface Activation {
  id: Uint8Array;
  smesherId: Uint8Array;
  coinbase: Uint8Array;
  prevAtx?: Uint8Array | null;
  layer: number;
  numUnits: number;
}
