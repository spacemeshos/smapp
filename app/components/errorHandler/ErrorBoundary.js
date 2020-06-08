// @flow
import React, { Component } from 'react';
import { CorneredWrapper, Button } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
`;

const InnerWrapper = styled.div`
  padding: 25px;
  background-color: ${smColors.lightGray};
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  margin-top: 20px;
`;

const Header = styled(Text)`
  margin-top: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) => (hasSingleButton ? 'center' : 'space-between')};
  margin-top: 30px;
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
        <Wrapper>
          <CorneredWrapper>
            <InnerWrapper>
              <Header>Something&#39;s wrong here...</Header>
              {explanationText && <Text>{explanationText}</Text>}
              <ButtonsWrapper hasSingleButton={!retryFunction}>
                <Button onClick={() => this.setState({ error: null })} text="REFRESH" />
                {retryFunction && <Button onClick={this.handleRetry} text="RETRY" isPrimary={false} style={{ marginLeft: 20 }} />}
              </ButtonsWrapper>
            </InnerWrapper>
          </CorneredWrapper>
        </Wrapper>
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
