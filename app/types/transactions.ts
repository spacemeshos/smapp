export interface Tx {
  txId: string;
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  status: number;
  layerId?: number;
  timestamp: number;
  nickname?: string;
  note?: string;
}

export type TxList = Array<Tx>;

export type AccountTxs = { [publicKey: string]: { txId: { tx: Tx } } };
