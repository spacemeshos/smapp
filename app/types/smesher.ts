export type ComputeProvider = {
  id: number;
  model: string;
  computeApi: string;
  performance: number;
};

export type ComputeProviders = Array<ComputeProvider>;

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
