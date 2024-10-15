export interface PausedQuicksyncStatus {
  layer: number;
  downloaded: number;
  total: number;
}

export interface QuicksyncStatus {
  db: number;
  current: number;
  available: number;
  paused: PausedQuicksyncStatus | null;
  partial: {
    from: number;
    to: number;
  } | null;
}
