import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ErrorBoundary } from '/components/errorHandler';

const ScreenErrorBoundry = (WrappedComponent, isFullScreen) =>
  hoistStatics(
    ({ ...props }) => (
      <ErrorBoundary isFullScreen={isFullScreen}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    ),
    WrappedComponent
  );

export default ScreenErrorBoundry;
