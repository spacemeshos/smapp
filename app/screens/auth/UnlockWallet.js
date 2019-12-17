import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { generateEncryptionKey, unlockWallet } from '/redux/wallet/actions';
import { CorneredContainer } from '/components/common';
import { LoggedOutBanner } from '/components/banners';
import { Link, Button, Input, ErrorPopup } from '/basicComponents';
import { smColors } from '/vars';
import { smallInnerSideBar, chevronRightBlack } from '/assets/images';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Text = styled.div`
  margin: -15px 0 15px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

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
  history: RouterHistory,
  generateEncryptionKey: Action,
  unlockWallet: Action,
  location: { state?: { isLoggedOut: boolean } }
};

type State = {
  password: string,
  hasError: boolean,
  isLoggedOutBannerVisible: boolean
};

class UnlockWallet extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.state = {
      password: '',
      hasError: false,
      isLoggedOutBannerVisible: location?.state?.isLoggedOut || false
    };
  }

  render() {
    const { history } = this.props;
    const { isLoggedOutBannerVisible, password, hasError } = this.state;
    return [
      isLoggedOutBannerVisible && <LoggedOutBanner key="banner" />,
      <CorneredContainer width={520} height={310} header="UNLOCK" subHeader="Welcome back to spacemesh" key="main">
        <Text>Please enter your wallet password</Text>
        <Indicator hasError={hasError} />
        <SmallSideBar src={smallInnerSideBar} />
        <InputSection>
          <Chevron src={chevronRightBlack} />
          <Input type="password" placeholder="ENTER PASSWORD" value={password} onEnterPress={this.decryptWallet} onChange={this.handlePasswordTyping} style={{ flex: 1 }} />
          <ErrorSection>
            {hasError && <ErrorPopup onClick={() => this.setState({ password: '', hasError: false })} text="sorry, this password doesn't ring a bell, please try again" />}
          </ErrorSection>
        </InputSection>
        <BottomPart>
          <LinksWrapper>
            <GrayText>FORGOT PASSWORD?</GrayText>
            <Link onClick={() => history.push('/auth/restore')} text="RESTORE" style={{ marginRight: 'auto' }} />
            <Link onClick={() => history.push('/auth/create')} text="CREATE" style={{ marginRight: 'auto' }} />
            <Link onClick={this.navigateToSetupGuide} text="SETUP GUIDE" style={{ marginRight: 'auto' }} />
          </LinksWrapper>
          <Button text="UNLOCK" isDisabled={!password.trim() || !!hasError} onClick={this.decryptWallet} style={{ marginTop: 'auto' }} />
        </BottomPart>
      </CorneredContainer>
    ];
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ password: value, hasError: false });
  };

  decryptWallet = async () => {
    const { generateEncryptionKey, unlockWallet, history } = this.props;
    const { password } = this.state;
    const passwordMinimumLength = 1; // TODO: For testing purposes, set to 1 minimum length. Should be changed back to 8 when ready.
    if (!!password && password.trim().length >= passwordMinimumLength) {
      try {
        const key = generateEncryptionKey({ password });
        await unlockWallet({ key });
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
  generateEncryptionKey,
  unlockWallet
};

UnlockWallet = connect(null, mapDispatchToProps)(UnlockWallet);

export default UnlockWallet;
