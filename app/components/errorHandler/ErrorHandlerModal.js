// @flow
import React, { Component } from 'react';
import { Modal, SmButton } from '/basicComponents';
import styled from 'styled-components';
import type { ErrorBoundaryMode } from '/components/errorHandler';
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
  mode: ErrorBoundaryMode,
  onButtonPress: ({ action: 'refresh' | 'go back' | 'retry' | 'cancel' }) => void
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

    return shouldShowModal ? (
      <Modal
        header={error.message || 'Error!'}
        isErrorAlert
        onCancelBtnClick={() => this.setState({ shouldShowModal: false })}
        onCloseClick={() => this.setState({ shouldShowModal: false })}
        content={this.renderModalBody()}
      />
    ) : null;
  }

  renderModalBody = () => {
    const { error, componentStack } = this.props;
    const buttons: ModalButton[] = this.getButtons();
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

  getButtons = (): ModalButton[] => {
    const { mode, onButtonPress } = this.props;
    const buttons: ModalButton[] = [];
    buttons.push({
      text: 'Cancel',
      theme: 'green',
      clickAction: (e) => {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        }
        onButtonPress && onButtonPress({ action: 'cancel' });
        this.setState({ shouldShowModal: false });
      }
    });
    mode.canRefresh &&
      buttons.push({
        text: 'Refresh',
        clickAction: (e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
          onButtonPress && onButtonPress({ action: 'refresh' });
        }
      });
    mode.canRetry &&
      buttons.push({
        text: 'Retry',
        clickAction: (e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
          onButtonPress && onButtonPress({ action: 'retry' });
        }
      });
    mode.canGoBack &&
      buttons.push({
        text: 'Go Back',
        clickAction: (e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation();
          }
          onButtonPress && onButtonPress({ action: 'go back' });
        }
      });
    return buttons;
  };
}

export default ErrorHandlerModal;
