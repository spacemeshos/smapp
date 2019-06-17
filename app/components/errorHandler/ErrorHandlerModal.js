// @flow
import React, { Component } from 'react';
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

type ModalButton = {
  text: string,
  clickAction: () => void,
  theme?: 'orange' | 'green'
};

type Props = {
  componentStack: string,
  error: Error,
  onRefresh: () => void
};

type State = {
  shouldShowModal: boolean
};

class ErrorHandlerModal extends Component<Props, State> {
  state = {
    shouldShowModal: true
  };

  render() {
    const { error } = this.props;
    const { shouldShowModal } = this.state;

    return shouldShowModal ? <Modal header={error.message || 'Error!'} isErrorAlert onCloseClick={() => {}} content={this.renderModalBody()} /> : null;
  }

  renderModalBody = () => {
    const { error, componentStack, onRefresh } = this.props;
    const buttons: ModalButton[] = [
      {
        text: 'Refresh',
        clickAction: (e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
          onRefresh && onRefresh();
        }
      }
    ];

    return (
      <Wrapper>
        <Text>{error.message || 'Error'}</Text>
        <div>{componentStack}</div>
        {buttons.length ? (
          <ButtonsWrapper>
            {buttons.map((button: ModalButton) => (
              <SmButton key={button.text} text={button.text} theme={button.theme || 'orange'} onPress={button.clickAction} style={{ marginRight: 20, minWidth: 150 }} />
            ))}
          </ButtonsWrapper>
        ) : null}
      </Wrapper>
    );
  };
}

export default ErrorHandlerModal;
