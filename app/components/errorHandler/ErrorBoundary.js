// @flow
import React, { Component } from 'react';
import { Modal } from '/components/common';
import { Button } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  margin-top: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) => (hasSingleButton ? 'center' : 'space-between')};
  margin: 30px 0 15px 0;
`;

type Props = {
  children: any
};

type State = {
  error: Object | null
};

class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null
  };

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      const { retryFunction } = error;
      const explanationText = `${retryFunction ? 'Retry failed action or refresh page.' : 'Try to refresh page.'}`;
      return (
        <Modal header="Something`s wrong here..." isErrorModal>
          {explanationText && <Text>{explanationText}</Text>}
          <ButtonsWrapper hasSingleButton={!retryFunction}>
            <Button onClick={() => this.setState({ error: null })} text="REFRESH" />
            {retryFunction && <Button onClick={this.handleRetry} text="RETRY" isPrimary={false} style={{ marginLeft: 20 }} />}
          </ButtonsWrapper>
        </Modal>
      );
    }
    return children;
  }

  componentDidCatch(error: any, info: any) {
    console.log(`${error.message} ${info.componentStack}`); // eslint-disable-line no-console
    this.setState({ error });
  }

  handleRetry = () => {
    const { error } = this.state;
    this.setState({ error: null });
    error && error.retryFunction();
  };
}

export default ErrorBoundary;
