import { QuicksyncStatus } from './types/quicksync';

export const isQuicksyncAvailable = (status: QuicksyncStatus) =>
  status.available > status.db;

export const isLocalStateFarBehind = (status: QuicksyncStatus, delta: number) =>
  status.current - delta > status.db;
