// @flow
import React, { PureComponent } from 'react';
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
  onRefresh: () => void,
  onRetry: () => void,
  explanationText?: string
};

class ErrorHandlerModal extends PureComponent<Props> {
  render() {
    const { onRetry, onRefresh, explanationText } = this.props;
    return (
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Header>Something&#39;s wrong here...</Header>
            {explanationText && <Text>{explanationText}</Text>}
            <ButtonsWrapper hasSingleButton={!onRetry}>
              <Button onClick={onRefresh} text="REFRESH" />
              {onRetry && <Button onClick={onRetry} text="RETRY" isPrimary={false} style={{ marginLeft: 20 }} />}
            </ButtonsWrapper>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
    );
  }
}

export default ErrorHandlerModal;
