// Original file: proto/smesher_types.proto


export interface PostInitOpts {
  'dataDir'?: (string);
  'numUnits'?: (number);
  'numFiles'?: (number);
  'computeProviderId'?: (number);
  'throttle'?: (boolean);
}

export interface PostInitOpts__Output {
  'dataDir': (string);
  'numUnits': (number);
  'numFiles': (number);
  'computeProviderId': (number);
  'throttle': (boolean);
}
