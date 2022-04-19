import { ActionReducerMapBuilder, AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';

const DEFAULT_IPC_REDUCERS = {
  onFulfilled: (state, action) => ({ ...state, ...action.payload }),
  onPending: (state) => state,
  onRejected: (state, action) => ({ ...state, error: action.payload }),
};

const createIpcAction = (typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<any>, { onFulfilled, onRejected, onPending } = DEFAULT_IPC_REDUCERS) => {
  const action = createAsyncThunk(typePrefix, payloadCreator);
  const build = (builder: ActionReducerMapBuilder<any>) => builder.addCase(action.fulfilled, onFulfilled).addCase(action.rejected, onRejected).addCase(action.pending, onPending);
  return [action, build];
};

export default createIpcAction;
