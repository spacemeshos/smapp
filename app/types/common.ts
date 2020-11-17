export interface Status {
  noConnection?: boolean;
  synced?: boolean;
  peers?: string;
  minPeers?: string;
  maxPeers?: string;
  syncedLayer?: string;
  currentLayer?: string;
  verifiedLayer?: string;
}
