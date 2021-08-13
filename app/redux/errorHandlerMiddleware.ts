import { AnyAction, Middleware } from 'redux';

const createErrorHandlerMiddleware = (onError: (error: Error) => AnyAction): Middleware => ({ dispatch }) => (next) => (action) => {
  try {
    const result = next(action);
    if (result.then && result.catch) {
      return result.catch((error) => {
        // eslint-disable-next-line promise/no-callback-in-promise
        next(onError(error));
        throw error;
      });
    }
    return result;
  } catch (error) {
    return next(onError(error));
  }
};

export default createErrorHandlerMiddleware;
