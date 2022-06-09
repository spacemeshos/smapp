export const epochByLayer = (layersPerEpoch: number) => (
  layer: number
): number => Math.floor(layer / layersPerEpoch);

export const timestampByLayer = (
  genesisTime: string,
  layerDurationSec: number
) => (layer: number): number =>
  layerDurationSec * 1000 * layer + Date.parse(genesisTime);

export const firstLayerInEpoch = (layersPerEpoch: number) => (
  epoch: number
): number => epoch * layersPerEpoch;
