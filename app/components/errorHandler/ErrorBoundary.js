import React, { Component } from 'react';
import type { ComponentType } from 'react';
import ErrorFallback from './ErrorFallback';

export type ErrorBoundaryMode = {
  canRefresh?: boolean,
  canRetry?: boolean,
  canGoBack?: boolean
};

type ErrorInfo = {
  componentStack: string
};

type Props = {
  children?: any,
  FallbackComponent?: ComponentType<any>,
  onError?: ({ error: Error, componentStack: string, afterErrorAction: 'refresh' | 'retry' | 'go back' }) => void,
  onButtonPress: ({ action: 'refresh' | 'go back' | 'retry' | 'cancel' }) => void,
  mode: { canRefresh: boolean }
};

type State = {
  error: ?Error,
  info: ?ErrorInfo
};

class ErrorBoundary extends Component<Props, State> {
  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    FallbackComponent: ErrorFallback
  };

  state = {
    error: null,
    info: null
  };

  render() {
    const { error, info } = this.state;
    const { children, FallbackComponent, mode, onButtonPress } = this.props;

    if (error !== null) {
      return <FallbackComponent componentStack={info ? info.componentStack : ''} error={error} mode={mode} onButtonPress={onButtonPress} />;
    }
    return children || null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError } = this.props;

    if (typeof onError === 'function') {
      try {
        onError.call(this, error, info ? info.componentStack : '');
      } catch (ignoredError) {
        // ignore this error
      }
    }

    this.setState({ error, info });
  }
}

export const withErrorBoundary = (
  Component: ComponentType<any>,
  FallbackComponent: ComponentType<any>,
  onError: Function,
  onButtonPress: Function,
  mode: ErrorBoundaryMode
): Function => {
  const Wrapped = (props) => (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError} mode={mode} onButtonPress={onButtonPress}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // Format for DevTools
  const name = Component.displayName || Component.name;
  Wrapped.displayName = name ? `WithErrorBoundary(${name})` : 'WithErrorBoundary';

  return Wrapped;
};

export default ErrorBoundary;
