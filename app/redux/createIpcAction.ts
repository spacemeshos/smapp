import {
  ActionReducerMapBuilder,
  AsyncThunk,
  AsyncThunkPayloadCreator,
  createAsyncThunk,
} from '@reduxjs/toolkit';

type EmptyObject = Record<string, never>;
type ActionFn<T> = AsyncThunk<T, void, EmptyObject>;
type BuildFn<T> = (
  builder: ActionReducerMapBuilder<T>
) => ActionReducerMapBuilder<T>;

const DEFAULT_IPC_REDUCERS = {
  onFulfilled: <S, T extends Partial<S>>(
    state: S,
    action: { type: string; payload: T }
  ) => ({ ...state, ...action.payload }),
  onPending: <S>(state: S): S => state,
  onRejected: <S, T extends Record<string, any>>(state: S, action: T): S => {
    // eslint-disable-next-line no-console
    console.error('IPC_REDUCER REJECTED: ', state, action);
    return state;
  },
};

const createIpcAction = <T>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<T>,
  { onFulfilled, onRejected, onPending } = DEFAULT_IPC_REDUCERS
): [ActionFn<T>, BuildFn<T>] => {
  const action = createAsyncThunk(typePrefix, payloadCreator);
  const build: BuildFn<T> = (builder) =>
    builder
      .addCase(action.fulfilled, onFulfilled)
      .addCase(action.rejected, onRejected)
      .addCase(action.pending, onPending);
  return [action, build];
};

export default createIpcAction;
