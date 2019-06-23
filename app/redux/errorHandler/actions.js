// @flow
import { Action } from '/types';

export const SET_GRPC_ERROR: string = 'SET_GRPC_ERROR';

export const setGrpcError = ({ grpcError }: { grpcError: ?Error }): Action => ({ type: SET_GRPC_ERROR, payload: { grpcError } });
