// @flow
import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { ErrorBoundary } from '/components/errorHandler';

const ScreenErrorBoundary = (WrappedComponent: any) =>
  hoistStatics(
    ({ ...props }) => (
      <ErrorBoundary>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    ),
    WrappedComponent
  );

export default ScreenErrorBoundary;
