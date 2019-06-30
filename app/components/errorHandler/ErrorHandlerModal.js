// @flow
import React, { PureComponent } from 'react';
import { Modal, SmButton } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${smColors.lighterBlack};
  line-height: 28px;
  margin-bottom: 12px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`;

type Props = {
  onRefresh: () => void,
  onRetry: () => void,
  explanationText?: string
};

class ErrorHandlerModal extends PureComponent<Props> {
  render() {
    return <Modal header="Oops!" isErrorAlert onCloseClick={() => {}} content={this.renderModalBody()} />;
  }

  renderModalBody = () => {
    const { onRetry, onRefresh, explanationText } = this.props;
    return (
      <Wrapper>
        <Text>Something went wrong.</Text>
        {explanationText && <Text>{explanationText}</Text>}
        <ButtonsWrapper>
          <SmButton text="Refresh" theme="orange" onPress={onRefresh} style={{ marginRight: 20, minWidth: 150 }} />
          {onRetry && <SmButton text="Retry" theme="orange" onPress={onRetry} style={{ marginRight: 20, minWidth: 150 }} />}
        </ButtonsWrapper>
      </Wrapper>
    );
  };
}

export default ErrorHandlerModal;
