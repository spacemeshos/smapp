import { ActionReducerMapBuilder, AsyncThunk, AsyncThunkPayloadCreator, createAsyncThunk } from '@reduxjs/toolkit';

type EmptyObject = Record<string, never>;
type IdentityFn<T> = (arg0: T) => T;

const DEFAULT_IPC_REDUCERS = {
  onFulfilled: (state, action) => ({ ...state, ...action.payload }),
  onPending: (state) => state,
  onRejected: (state, action) => ({ ...state, error: action.payload }),
};

const createIpcAction = <T>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<T>,
  { onFulfilled, onRejected, onPending } = DEFAULT_IPC_REDUCERS
): [AsyncThunk<T, void, EmptyObject>, (builder: ActionReducerMapBuilder<T>) => ActionReducerMapBuilder<T>] => {
  const action = createAsyncThunk(typePrefix, payloadCreator);
  const build: IdentityFn<ActionReducerMapBuilder<T>> = (builder) =>
    builder.addCase(action.fulfilled, onFulfilled).addCase(action.rejected, onRejected).addCase(action.pending, onPending);
  return [action, build];
};

export default createIpcAction;
