import React, { Component } from 'react';
import { ErrorHandlerModal } from '/components/errorHandler';

type Props = {
  children?: any
};

type State = {
  error: ?Error,
  info: ?{ componentStack: string }
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
      return <ErrorHandlerModal componentStack={info ? info.componentStack : ''} error={error} onRefresh={() => this.setState({ error: null, info: null })} />;
    }
    return children;
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error(`${error.message} ${info.componentStack}`);
    this.setState({ error, info });
  }
}

export default ErrorBoundary;
