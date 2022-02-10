import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgressInfo, UpdateInfo } from 'electron-updater';

export interface UpdaterState {
  availableUpdate: UpdateInfo | null;
  downloadedUpdate: UpdateInfo | null;
  isDownloading: boolean;
  progress: ProgressInfo | null;
  error: Error | null;
}

const initialState: UpdaterState = {
  availableUpdate: null,
  downloadedUpdate: null,
  isDownloading: false,
  progress: null,
  error: null,
};

const slice = createSlice({
  name: 'updater',
  initialState,
  reducers: {
    updateAvailable: (state, action: PayloadAction<UpdateInfo>) => ({ ...state, availableUpdate: action.payload }),
    updateProgress: (state, action: PayloadAction<ProgressInfo>) => ({ ...state, progress: action.payload }),
    updateDownloaded: (state, action: PayloadAction<UpdateInfo>) => ({ ...state, downloadedUpdate: action.payload, isDownloading: false }),
    setError: (state, action: PayloadAction<Error>) => ({ ...state, error: action.payload }),
    setDownloading: (state, action: PayloadAction<boolean>) => ({ ...state, isDownloading: action.payload }),
  },
});

export default slice;
