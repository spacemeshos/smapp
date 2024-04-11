import { SmesherConfig } from './types';

const DEFAULT_SMESHING_CONFIG: SmesherConfig = {
  bitsPerLabel: 128,
  labelsPerUnit: 4294967296,
  minNumUnits: 4,
  maxNumUnits: 1048576,
};

export default DEFAULT_SMESHING_CONFIG;
