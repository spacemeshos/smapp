export type Reward = {
  txId: 'reward';
  layerId: number;
  total: number;
  layerReward: number;
  // layerComputed: number;
  coinbase: string;
  smesher: string;
  status: number;
  timestamp: number;
};

export const BITS = 8;

export const BITS_PER_LABEL = 128;
