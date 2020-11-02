// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { unlockWallet } from '/redux/wallet/actions';
import { Modal } from '/components/common';
import { Button, Input, ErrorPopup } from '/basicComponents';
import { chevronRightBlack, chevronRightWhite } from '/assets/images';
import type { Action } from '/types';

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

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0 15px 0;
`;

type Props = {
  unlockWallet: Action,
  submitAction: ({ password: string }) => void,
  closeModal: () => void,
  isDarkModeOn: boolean
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
    const { closeModal, isDarkModeOn } = this.props;
    const { password, hasError } = this.state;
    const chevronIcon = isDarkModeOn ? chevronRightWhite : chevronRightBlack;

    return (
      <Modal header="PASSWORD" subHeader="enter password to complete the action">
        <InputSection>
          <Chevron src={chevronIcon} />
          <Input type="password" placeholder="ENTER PASSWORD" value={password} onEnterPress={this.submitActionWrapper} onChange={this.handlePasswordTyping} />
          <ErrorSection>
            {hasError && <ErrorPopup onClick={() => this.setState({ password: '', hasError: false })} text="sorry, this password doesn't ring a bell, please try again" />}
          </ErrorSection>
        </InputSection>
        <ButtonsWrapper>
          <Button text="UNLOCK" isDisabled={!password.trim() || !!hasError} onClick={this.submitActionWrapper} />
          <Button text="CANCEL" isPrimary={false} onClick={closeModal} />
        </ButtonsWrapper>
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

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  unlockWallet
};

EnterPasswordModal = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(EnterPasswordModal);

export default EnterPasswordModal;
