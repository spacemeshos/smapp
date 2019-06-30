import React, { Component } from 'react';
import { ErrorHandlerModal } from '/components/errorHandler';

type Props = {
  children?: any
};

type State = {
  error: ?Error,
  info?: Object
};

class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null,
    info: null
  };

  render() {
    const { error, info } = this.state;
    const { children } = this.props;

    if (error) {
      const { retryFunction } = error;
      return (
        <ErrorHandlerModal
          componentStack={info ? info.componentStack : ''}
          explanationText={`${retryFunction ? 'Retry failed action or refresh page' : 'Try to refresh page'}`}
          error={error}
          onRetry={retryFunction ? () => this.handleRetry(retryFunction) : null}
          onRefresh={() => this.setState({ error: null, info: null })}
        />
      );
    }
    return children;
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.log(`${error.message} ${info.componentStack}`);
    this.setState({ error, info });
  }

  handleRetry = (retryFunction) => {
    this.setState({ error: null, info: null });
    retryFunction();
  };
}

export default ErrorBoundary;
