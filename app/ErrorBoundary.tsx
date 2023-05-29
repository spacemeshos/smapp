/**
 * This is an extended version of classic React Error Boundary.
 * It catches errors in rendering, but it also show other errors:
 * - errors in rendering
 * - errors stored in Redux (via actions)
 */

import React, { Component } from 'react';
import styled from 'styled-components';
import { captureException } from '@sentry/react';
import { connect } from 'react-redux';
import { Modal } from './components/common';
import { Button } from './basicComponents';
import { RootState } from './types';
import { setUiError } from './redux/ui/actions';
import { smColors } from './vars';

const ButtonsWrapper = styled.div<{ hasSingleButton: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) =>
    hasSingleButton ? 'center' : 'space-between'};
  margin: auto 0 15px 0;
  padding-top: 30px;
`;

const ErrorMessage = styled.pre`
  font-size: 14px;
  line-height: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex: 1;
  overflow-y: auto;
`;

type Props = {
  children: any;
  error: Error | null;
  setUiError: (Error) => void;
};
type State = {
  isRenderingError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  state = {
    isRenderingError: false,
  };

  render() {
    const { children, error } = this.props;
    const { isRenderingError } = this.state;
    return (
      <>
        {error && (
          <Modal header="ERROR :-(" indicatorColor={smColors.orange}>
            --
            <ErrorMessage>{error.message}</ErrorMessage>
            <ButtonsWrapper hasSingleButton>
              <Button onClick={this.resetError} text="CLOSE" />
            </ButtonsWrapper>
          </Modal>
        )}
        {!isRenderingError ? children : null}
      </>
    );
  }

  static getDerivedStateFromError() {
    // We don't need inner state, because we have one source of truth
    // and this is a redux state `ui.error`
    // So this method needed just to get rid of React warning
    return { isRenderingError: true };
  }

  componentDidCatch(
    error: Error,
    { componentStack }: { componentStack: string }
  ) {
    console.log(`${error.message} ${componentStack}`); // eslint-disable-line no-console
    captureException(error);

    const { setUiError } = this.props;
    const failedComponentMatch = componentStack
      .split('\n')
      .filter((str) => !!str)[0]
      .trim()
      .match(/at\s(.+)\s/);
    const failedComponent = failedComponentMatch && failedComponentMatch[1];
    const details = failedComponent ? ` in ${failedComponent} component` : '';
    error.stack = `${error.stack}\n\nComponent Stack:\n${componentStack}`;
    error.message = `Render error${details}:\n${error.message}`;
    setUiError(error);
  }

  resetError = () => {
    const { setUiError } = this.props;
    setUiError(null);
    this.setState({ isRenderingError: false });
  };
}

const mapStateToProps = (state: RootState) => ({
  error: state.ui.error,
});

const mapDispatchToProps = { setUiError };

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
