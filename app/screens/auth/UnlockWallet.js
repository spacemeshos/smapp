import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { deriveEncryptionKey, unlockWallet } from '/redux/wallet/actions';
import { Container } from '/components/common';
import { Link, Button, Input, ErrorPopup } from '/basicComponents';
import { smColors } from '/vars';
import { smallInnerSideBar, chevronRightBlack } from '/assets/images';
import type { Action } from '/types';

// $FlowStyledIssue
const Indicator = styled.div`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({ hasError }) => (hasError ? smColors.orange : smColors.black)};
`;

const SmallSideBar = styled.img`
  position: absolute;
  bottom: 0;
  right: -30px;
  width: 15px;
  height: 50px;
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

const BottomPart = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding-top: 45px;
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const GrayText = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.disabledGray};
`;

type Props = {
  history: { push: (string) => void },
  deriveEncryptionKey: Action,
  unlockWallet: Action
};

type State = {
  passphrase: string,
  hasError: boolean
};

class UnlockWallet extends Component<Props, State> {
  state = {
    passphrase: '',
    hasError: false
  };

  render() {
    const { history } = this.props;
    const { passphrase, hasError } = this.state;
    return (
      <Container width={520} height={310} header="UNLOCK" subHeader="welcome back to spacemesh">
        <Indicator hasError={hasError} />
        <SmallSideBar src={smallInnerSideBar} />
        <InputSection>
          <Chevron src={chevronRightBlack} />
          <Input type="password" placeholder="ENTER PASSWORD" value={passphrase} onEnterPress={this.handleEnterPress} onChange={this.handlePasswordTyping} style={{ flex: 1 }} />
          <ErrorSection>
            {hasError && <ErrorPopup onClick={() => this.setState({ passphrase: '', hasError: false })} text="sorry, this password doesn't ring a bell, please try again" />}
          </ErrorSection>
        </InputSection>
        <BottomPart>
          <LinksWrapper>
            <GrayText>FORGOT PASSWORD?</GrayText>
            <Link onClick={() => history.push('/auth/restore')} text="RESTORE" />
            <Link onClick={() => history.push('/auth/create')} text="CREATE" />
            <Link onClick={this.navigateToSetupGuide} text="SETUP GUIDE" />
          </LinksWrapper>
          <Button text="Unlock" isDisabled={!passphrase.trim() || !!hasError} onClick={this.decryptWallet} style={{ marginTop: 'auto' }} />
        </BottomPart>
      </Container>
    );
  }

  handleEnterPress = () => {
    const { passphrase, hasError } = this.state;
    if (!!passphrase.trim() || !hasError) {
      this.decryptWallet();
    }
  };

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, hasError: false });
  };

  decryptWallet = async () => {
    const { deriveEncryptionKey, unlockWallet, history } = this.props;
    const { passphrase } = this.state;
    const passwordMinimumLength = 1; // TODO: For testing purposes, set to 1 minimum length. Should be changed back to 8 when ready.
    if (passphrase.trim().length >= passwordMinimumLength) {
      try {
        deriveEncryptionKey({ passphrase });
        await unlockWallet();
        history.push('/main/wallet');
      } catch (error) {
        if (error.message.indexOf('Unexpected token') === 0) {
          this.setState({ hasError: true });
        } else {
          this.setState(() => {
            throw error;
          });
        }
      }
    }
  };

  navigateToSetupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');
}

const mapDispatchToProps = {
  deriveEncryptionKey,
  unlockWallet
};

UnlockWallet = connect(
  null,
  mapDispatchToProps
)(UnlockWallet);

export default UnlockWallet;
