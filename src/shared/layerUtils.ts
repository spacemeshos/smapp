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

export const nextEpochTime = (
  genesisTime: string,
  layerDurationSec: number,
  layersPerEpoch: number
) => (layer: number): number => {
  const curEpoch = epochByLayer(layersPerEpoch)(layer);
  const nextEpoch = curEpoch + 1;
  return timestampByLayer(
    genesisTime,
    layerDurationSec
  )(firstLayerInEpoch(layersPerEpoch)(nextEpoch));
};
