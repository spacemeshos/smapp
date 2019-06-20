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
  max-height: 200px;
  overflow-y: scroll;
`;

const DetailsText = styled(Text)`
  font-size: 14px;
  line-height: 22px;
`;

type Props = {
  componentStack: string,
  error: Error,
  onRefresh: () => void,
  isFullScreen: boolean
};

class ErrorHandlerModal extends PureComponent<Props> {
  render() {
    const { error, isFullScreen } = this.props;
    return <Modal header={error.message || 'Error!'} isFullScreen={isFullScreen} isErrorAlert onCloseClick={() => {}} content={this.renderModalBody()} />;
  }

  renderModalBody = () => {
    const { error, componentStack } = this.props;

    return (
      <Wrapper>
        <Text>Error Details</Text>
        <ErrorDetails>
          <DetailsText>{`${error.message || 'Error'} ${componentStack}`}</DetailsText>
        </ErrorDetails>
        <ButtonsWrapper>
          <SmButton text="Refresh" theme="orange" onPress={this.handleRefresh} style={{ marginRight: 20, minWidth: 150 }} />
        </ButtonsWrapper>
      </Wrapper>
    );
  };

  handleRefresh = (e: { stopPropagation?: () => void }) => {
    const { onRefresh } = this.props;

    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    onRefresh && onRefresh();
  };
}

export default ErrorHandlerModal;
