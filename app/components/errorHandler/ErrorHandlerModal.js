// @flow
import React, { PureComponent } from 'react';
import { Modal, SmButton } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  padding: 20px;
`;

const Text = styled.span`
  font-size: 16px;
  color: ${smColors.lighterBlack};
  line-height: 28px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ErrorDetails = styled.div`
  height: 200px;
  overflow-y: scroll;
`;

const DetailsText = styled(Text)`
  font-size: 14px;
  line-height: 22px;
`;

type Props = {
  componentStack: string,
  error: Error,
  onRefresh: () => void
};

class ErrorHandlerModal extends PureComponent<Props> {
  render() {
    const { error } = this.props;
    return <Modal header={error.message || 'Error!'} isErrorAlert onCloseClick={() => {}} content={this.renderModalBody()} />;
  }

  renderModalBody = () => {
    const { error, componentStack } = this.props;

    return (
      <Wrapper>
        <Text>{error.message || 'Error'}</Text>
        <ErrorDetails>
          <DetailsText>{componentStack}</DetailsText>
        </ErrorDetails>
        <ButtonsWrapper>
          <SmButton text="Refresh" theme="orange" onPress={this.handleRefresh} style={{ marginRight: 20, minWidth: 150 }} />
        </ButtonsWrapper>
      </Wrapper>
    );
  };

  handleRefresh = (e: SyntheticEvent<any>) => {
    const { onRefresh } = this.props;

    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    onRefresh && onRefresh();
  };
}

export default ErrorHandlerModal;
