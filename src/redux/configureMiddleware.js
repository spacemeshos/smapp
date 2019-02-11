import thunk from 'redux-thunk';

const configureMiddleware = ({ deps }: { deps?: Object }) => {
  const middleware = [thunk.withExtraArgument(deps)];

  return middleware;
};

export default configureMiddleware;
