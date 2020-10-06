export type NodeStatus = {
  peers: number,
  minPeers: number,
  maxPeers: number,
  synced: boolean,
  syncedLayer: number,
  currentLayer: number,
  verifiedLayer: number
};
