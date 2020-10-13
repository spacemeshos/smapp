// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { unlockWallet } from '/redux/wallet/actions';
import { Modal, DefaultModalView } from '/components/common';
import { Input, ErrorPopup } from '/basicComponents';
import { chevronRightBlack, chevronRightWhite } from '/assets/images';
import type { Action } from '/types';
import { shell } from 'electron';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const chevronIcon = isDarkModeOn ? chevronRightWhite : chevronRightBlack;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Chevron = styled.img`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const ErrorSection = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  margin-left: 10px;
`;

type Props = {
  unlockWallet: Action,
  submitAction: ({ password: string }) => void,
  closeModal: () => void
};

type State = {
  password: string,
  hasError: boolean
};

class EnterPasswordModal extends Component<Props, State> {
  state = {
    password: '',
    hasError: false
  };

  render() {
    const { closeModal } = this.props;
    const { password, hasError } = this.state;
    return (
      <Modal header="PASSWORD" subHeader="enter password to complete the action" hasError={hasError}>
        <DefaultModalView
          guideLinkText="REFERENCE GUIDE"
          guideLinkHandler={() => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup')}
          cancelLinkHandler={closeModal}
          nextButtonIsDisabled={!password.trim() || !!hasError}
          nextButtonClickHandler={this.submitActionWrapper}
        >
          <InputSection>
            <Chevron src={chevronIcon} />
            <Input type="password" placeholder="ENTER PASSWORD" value={password} onEnterPress={this.submitActionWrapper} onChange={this.handlePasswordTyping} />
            <ErrorSection>
              {hasError && <ErrorPopup onClick={() => this.setState({ password: '', hasError: false })} text="sorry, this password doesn't ring a bell, please try again" />}
            </ErrorSection>
          </InputSection>
        </DefaultModalView>
      </Modal>
    );
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ password: value, hasError: false });
  };

  submitActionWrapper = async () => {
    const { unlockWallet, submitAction } = this.props;
    const { password } = this.state;
    try {
      await unlockWallet({ password });
      submitAction({ password });
    } catch {
      this.setState({ hasError: true });
    }
  };
}

const mapDispatchToProps = {
  unlockWallet
};

EnterPasswordModal = connect<any, any, _, _, _, _>(null, mapDispatchToProps)(EnterPasswordModal);

export default EnterPasswordModal;
