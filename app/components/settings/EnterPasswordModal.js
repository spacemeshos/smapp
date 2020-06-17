// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { unlockWallet } from '/redux/wallet/actions';
import { CorneredWrapper, Button, Input, ErrorPopup } from '/basicComponents';
import { smColors } from '/vars';
import { chevronRightBlack } from '/assets/images';
import type { Action } from '/types';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 2;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 415px;
  padding: 25px;
  background-color: ${smColors.lightGray};
`;

const Header = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
  margin-bottom: 20px;
`;

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
  margin-top: 20px;
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
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Header>Enter password to complete the action</Header>
            <InputSection>
              <Chevron src={chevronRightBlack} />
              <Input type="password" placeholder="ENTER PASSWORD" value={password} onEnterPress={this.submitActionWrapper} onChange={this.handlePasswordTyping} />
              <ErrorSection>
                {hasError && <ErrorPopup onClick={() => this.setState({ password: '', hasError: false })} text="sorry, this password doesn't ring a bell, please try again" />}
              </ErrorSection>
            </InputSection>
            <ButtonsWrapper>
              <Button text="UNLOCK" isDisabled={!password.trim() || !!hasError} onClick={this.submitActionWrapper} />
              <Button text="CANCEL" isPrimary={false} onClick={closeModal} />
            </ButtonsWrapper>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
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
