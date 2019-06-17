import React, { Component } from 'react';
import type { ComponentType } from 'react';
import { ErrorHandlerModal, ErrorFallback } from '/components/errorHandler';

type ErrorInfo = {
  componentStack: string
};

type Props = {
  children?: any,
  isModal: boolean
};

type State = {
  error: ?Error,
  info: ?ErrorInfo
};

class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null,
    info: null
  };

  render() {
    const { error, info } = this.state;
    const { children, isModal } = this.props;
    const FallbackComponent = isModal ? ErrorHandlerModal : ErrorFallback;

    if (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
      return <FallbackComponent componentStack={info ? info.componentStack : ''} error={error} onRefresh={() => this.setState({ error: null, info: null })} />;
    }
    return children;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
  }
}

export const withErrorBoundary = (Component: ComponentType<any>, isModal = true): Function => {
  const Wrapped = (props) => (
    <ErrorBoundary isModal={isModal}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // Format for DevTools
  const name = Component.displayName || Component.name;
  Wrapped.displayName = name ? `WithErrorBoundary(${name})` : 'WithErrorBoundary';

  return Wrapped;
};

export default ErrorBoundary;
