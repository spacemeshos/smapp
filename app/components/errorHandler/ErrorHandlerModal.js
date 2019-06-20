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
  onRefresh: () => void
};

class ErrorHandlerModal extends PureComponent<Props> {
  render() {
    return <Modal header="Oops!" isErrorAlert onCloseClick={() => {}} content={this.renderModalBody()} />;
  }

  renderModalBody = () => (
    <Wrapper>
      <Text>Something went wrong.</Text>
      <Text>Try to refresh page</Text>
      <ButtonsWrapper>
        <SmButton text="Refresh" theme="orange" onPress={this.handleRefresh} style={{ marginRight: 20, minWidth: 150 }} />
      </ButtonsWrapper>
    </Wrapper>
  );

  handleRefresh = (e: { stopPropagation?: () => void }) => {
    const { onRefresh } = this.props;

    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    onRefresh && onRefresh();
  };
}

export default ErrorHandlerModal;
