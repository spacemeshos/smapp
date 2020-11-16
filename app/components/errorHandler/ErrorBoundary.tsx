import React, { Component } from 'react';
import styled from 'styled-components';
import { Modal } from '../common';
import { Button } from '../../basicComponents';
import { smColors } from '../../vars';

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  margin-top: 20px;
`;

const ButtonsWrapper = styled.div<{ hasSingleButton: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) => (hasSingleButton ? 'center' : 'space-between')};
  margin: 30px 0 15px 0;
`;

type Props = {
  children: any;
};

type State = {
  error: any;
};

class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null
  };

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { retryFunction } = error;
      const explanationText = `${retryFunction ? 'Retry failed action or refresh page.' : 'Try to refresh page.'}`;
      return (
        <Modal header="Something`s wrong here..." headerColor={smColors.orange}>
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (error && error.retryFunction) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      error.retryFunction();
    }
  };
}

export default ErrorBoundary;
