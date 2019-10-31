import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { generateEncryptionKey, saveNewWallet } from '/redux/wallet/actions';
import { CorneredContainer } from '/components/common';
import { StepsContainer, Input, Button, SecondaryButton, Link, Loader, ErrorPopup, SmallHorizontalPanel } from '/basicComponents';
import { fileSystemService } from '/infra/fileSystemService';
import { chevronRightBlack, chevronLeftWhite } from '/assets/images';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';
import { nodeConsts } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
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

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

type Props = {
  generateEncryptionKey: Action,
  miningStatus: number,
  saveNewWallet: Action,
  history: RouterHistory,
  location: { state: { mnemonic?: string, withoutNode?: boolean } }
};

type State = {
  subMode: 1 | 2,
  password: string,
  verifiedPassword: string,
  passwordError: string,
  verifyPasswordError: string,
  isLoaderVisible: boolean
};

class CreateWallet extends Component<Props, State> {
  state = {
    subMode: 1,
    password: '',
    verifiedPassword: '',
    passwordError: '',
    verifyPasswordError: '',
    isLoaderVisible: false
  };

  render() {
    const { history, location, miningStatus } = this.props;
    const { isLoaderVisible, subMode, password, verifiedPassword, passwordError, verifyPasswordError } = this.state;
    if (isLoaderVisible) {
      return (
        <LoaderWrapper>
          <Loader size={Loader.sizes.BIG} />
        </LoaderWrapper>
      );
    }
    const header = subMode === 1 ? 'PROTECT YOUR WALLET' : 'WALLET PASSWORD PROTECTED';
    const isWalletOnlySetup = !!location?.state?.withoutNode || miningStatus !== nodeConsts.NOT_MINING;
    return (
      <Wrapper>
        <StepsContainer
          steps={isWalletOnlySetup ? ['PROTECT WALLET'] : ['PROTECT WALLET', 'SELECT DRIVE', 'ALLOCATE SPACE']}
          header={isWalletOnlySetup ? 'SETUP WALLET' : 'SETUP WALLET + FULL NODE'}
          currentStep={0}
        />
        <CorneredContainer width={650} height={400} header={header} subHeader={this.renderSubHeader(subMode, isWalletOnlySetup)}>
          <SmallHorizontalPanel />
          {subMode === 1 && (
            <>
              <SecondaryButton onClick={history.goBack} img={chevronLeftWhite} imgWidth={10} imgHeight={15} style={{ position: 'absolute', bottom: 0, left: -35 }} />
              <UpperPart>
                <Inputs>
                  <InputSection>
                    <Chevron src={chevronRightBlack} />
                    <Input value={password} type="password" placeholder="ENTER PASSWORD" onEnterPress={this.handleEnterPress} onChange={this.handlePasswordTyping} />
                  </InputSection>
                  <InputSection>
                    <Chevron src={chevronRightBlack} />
                    <Input value={verifiedPassword} type="password" placeholder="VERIFY PASSWORD" onEnterPress={this.handleEnterPress} onChange={this.handlePasswordVerifyTyping} />
                  </InputSection>
                </Inputs>
                <ErrorSection>
                  {(!!passwordError || !!verifyPasswordError) && (
                    <ErrorPopup onClick={() => this.setState({ passwordError: '', verifyPasswordError: '' })} text={passwordError || verifyPasswordError} />
                  )}
                </ErrorSection>
              </UpperPart>
            </>
          )}
          <BottomPart>
            <Link onClick={this.navigateToExplanation} text="WALLET GUIDE" />
            {subMode === 1 && <Link onClick={() => history.push('/auth/restore')} text="RESTORE WALLET" />}
            <Button onClick={this.nextAction} text="NEXT" />
          </BottomPart>
        </CorneredContainer>
      </Wrapper>
    );
  }

  renderSubHeader = (subMode: number, isWalletOnlySetup: boolean) => {
    return subMode === 1 ? (
      <span>
        Enter your password
        <br />
        It must be at least 8 characters
      </span>
    ) : (
      <div>
        For future reference, a restore file is now on your computer
        <br />
        <Link onClick={this.openWalletBackupDirectory} text="Browse file location" />
      </div>
    );
  };

  handleEnterPress = () => {
    if (this.validate()) {
      this.createWallet();
    }
  };

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ password: value, passwordError: '' });
  };

  handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPassword: value, verifyPasswordError: '' });
  };

  validate = () => {
    const { password, verifiedPassword } = this.state;
    const pasMinLength = 1; // TODO: Changed to 8 before testnet.
    const hasPasswordError = !password || (!!password && password.length < pasMinLength);
    const hasVerifyPasswordError = !verifiedPassword || password !== verifiedPassword;
    const passwordError = hasPasswordError ? `Password has to be ${pasMinLength} characters or more.` : '';
    const verifyPasswordError = hasVerifyPasswordError ? "these passwords don't match, please try again " : '';
    this.setState({ passwordError, verifyPasswordError });
    return !passwordError && !verifyPasswordError;
  };

  nextAction = () => {
    const { history, location, miningStatus } = this.props;
    const { subMode } = this.state;
    const isWalletOnlySetup = !!location?.state?.withoutNode || miningStatus !== nodeConsts.NOT_MINING;
    if (subMode === 1 && this.validate()) {
      this.createWallet();
    } else if (subMode === 2) {
      if (isWalletOnlySetup) {
        history.push('/main/wallet');
      } else {
        history.push('/main/node-setup');
      }
    }
  };

  createWallet = async () => {
    const { generateEncryptionKey, saveNewWallet, location } = this.props;
    const { password, isLoaderVisible } = this.state;
    if (!isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      try {
        await setTimeout(async () => {
          await generateEncryptionKey({ password });
          saveNewWallet({ mnemonic: location?.state?.mnemonic });
          this.setState({ isLoaderVisible: false, subMode: 2 });
        }, 500);
      } catch (err) {
        this.setState(() => {
          throw err;
        });
      }
    }
  };

  navigateToExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');

  openWalletBackupDirectory = () => {
    fileSystemService.openWalletBackupDirectory({});
  };
}

const mapStateToProps = (state) => ({
  miningStatus: state.node.miningStatus
});

const mapDispatchToProps = {
  generateEncryptionKey,
  saveNewWallet
};

CreateWallet = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWallet);

export default CreateWallet;
