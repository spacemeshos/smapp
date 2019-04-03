// @flow

export type Tx = {
  isSent?: boolean,
  isReceived?: boolean,
  isPending?: boolean,
  isRejected?: boolean,
  amount: number,
  address: string,
  date: string
};

export type TxList = Tx[];
