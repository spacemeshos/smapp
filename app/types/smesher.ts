export type ComputeProvider = {
  id: number;
  model: string;
  computeApi: string;
  performance: number;
};

export type ComputeProviders = Array<ComputeProvider>;
