// @flow

export type Tx = {
  txId: string,
  sender: string,
  receiver: string,
  amount: number,
  fee: number,
  status: number,
  layerId: number,
  timestamp: number,
  nickname?: string,
  note?: string
};

export type TxList = Tx[];

export type AccountTxs = Array<{ layerId: number, data: TxList }>;
