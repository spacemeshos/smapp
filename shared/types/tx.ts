import { _spacemesh_v1_TransactionState_TransactionState as TxState } from '../../proto/spacemesh/v1/TransactionState';
import { _spacemesh_v1_TransactionReceipt_TransactionResult as TxResult } from '../../proto/spacemesh/v1/TransactionReceipt';
import { _spacemesh_v1_SmartContractTransaction_TransactionType as TxSmartContractType } from '../../proto/spacemesh/v1/SmartContractTransaction';
import { HexString } from './misc';

export { _spacemesh_v1_TransactionState_TransactionState as TxState } from '../../proto/spacemesh/v1/TransactionState';
export { _spacemesh_v1_TransactionReceipt_TransactionResult as TxResult } from '../../proto/spacemesh/v1/TransactionReceipt';
export { _spacemesh_v1_SmartContractTransaction_TransactionType as TxSmartContractType } from '../../proto/spacemesh/v1/SmartContractTransaction';

// Transactions

interface TxReceipt {
  fee: number;
  result?: TxResult;
  gasUsed?: number;
  svmData?: HexString;
}

export interface TxCoinTransfer {
  id: HexString;
  sender: HexString;
  receiver: HexString;
  status: TxState;
  amount: number;
  receipt?: TxReceipt;
  gasOffered?: {
    price: number;
    provided: number;
  };
  layer?: number;
  note?: string;
}

export interface TxSmartContract extends TxCoinTransfer {
  contract: {
    type: TxSmartContractType;
    data: HexString;
  };
}

export type Tx = TxCoinTransfer | TxSmartContract;

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
  smesher: HexString;
  amount: number;
  layer: number;
  layerReward: number;
  layerComputed?: number; // TODO ?
}
