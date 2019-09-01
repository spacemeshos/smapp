import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { generateEncryptionKey, saveNewWallet } from '/redux/wallet/actions';
import { CorneredContainer } from '/components/common';
import { StepsContainer, Input, Button, SecondaryButton, Link, Loader, ErrorPopup } from '/basicComponents';
import { fileSystemService } from '/infra/fileSystemService';
import { smallHorizontalSideBar, chevronRightBlack, chevronLeftWhite } from '/assets/images';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const SideBar = styled.img`
  position: absolute;
  top: -30px;
  right: 0;
  width: 55px;
  height: 15px;
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
  saveNewWallet: Action,
  history: RouterHistory,
  location: { state: { mnemonic?: string, withoutNode?: boolean } }
};

type State = {
  subMode: 1 | 2,
  passphrase: string,
  verifiedPassphrase: string,
  passphraseError: string,
  verifyPassphraseError: string,
  isLoaderVisible: boolean
};

class CreateWallet extends Component<Props, State> {
  state = {
    subMode: 1,
    passphrase: '',
    verifiedPassphrase: '',
    passphraseError: '',
    verifyPassphraseError: '',
    isLoaderVisible: false
  };

  render() {
    const { history, location } = this.props;
    const { isLoaderVisible, subMode, passphrase, verifiedPassphrase, passphraseError, verifyPassphraseError } = this.state;
    if (isLoaderVisible) {
      return (
        <LoaderWrapper>
          <Loader size={Loader.sizes.BIG} />
        </LoaderWrapper>
      );
    }
    const header = subMode === 1 ? 'PROTECT YOUR WALLET' : 'WALLET PASSWORD PROTECTED';
    const isWalletOnlySetup = !!location?.state?.withoutNode;
    return (
      <Wrapper>
        <StepsContainer
          steps={isWalletOnlySetup ? ['SETUP WALLET', 'PROTECT WALLET'] : ['SETUP WALLET + MINER', 'PROTECT WALLET', 'SELECT DRIVE', 'ALLOCATE SPACE']}
          currentStep={1}
        />
        <CorneredContainer width={650} height={400} header={header} subHeader={this.renderSubHeader(subMode, isWalletOnlySetup)}>
          <SideBar src={smallHorizontalSideBar} />
          {subMode === 1 && (
            <>
              <SecondaryButton onClick={history.goBack} img={chevronLeftWhite} imgWidth={10} imgHeight={15} style={{ position: 'absolute', bottom: 0, left: -35 }} />
              <UpperPart>
                <Inputs>
                  <InputSection>
                    <Chevron src={chevronRightBlack} />
                    <Input value={passphrase} type="password" placeholder="ENTER PASSPHRASE" onEnterPress={this.handleEnterPress} onChange={this.handlePasswordTyping} />
                  </InputSection>
                  <InputSection>
                    <Chevron src={chevronRightBlack} />
                    <Input
                      value={verifiedPassphrase}
                      type="password"
                      placeholder="VERIFY PASSPHRASE"
                      onEnterPress={this.handleEnterPress}
                      onChange={this.handlePasswordVerifyTyping}
                    />
                  </InputSection>
                </Inputs>
                <ErrorSection>
                  {(!!passphraseError || !!verifyPassphraseError) && (
                    <ErrorPopup onClick={() => this.setState({ passphraseError: '', verifyPassphraseError: '' })} text={passphraseError || verifyPassphraseError} />
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
        <Link onClick={this.openWalletBackupDirectory} text="Show me where it is!" />
        {!isWalletOnlySetup && (
          <span>
            Next, you&#39;re going to commit storage space from your hard
            <br />
            drive in order for it to be used while mining
          </span>
        )}
      </div>
    );
  };

  handleEnterPress = () => {
    if (this.validate()) {
      this.createWallet();
    }
  };

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, passphraseError: '' });
  };

  handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPassphrase: value, verifyPassphraseError: '' });
  };

  validate = () => {
    const { passphrase, verifiedPassphrase } = this.state;
    const pasMinLength = 1; // TODO: Changed to 8 before testnet.
    const hasPassphraseError = !passphrase || (!!passphrase && passphrase.length < pasMinLength);
    const hasVerifyPassphraseError = !verifiedPassphrase || passphrase !== verifiedPassphrase;
    const passphraseError = hasPassphraseError ? `Passphrase has to be ${pasMinLength} characters or more.` : '';
    const verifyPassphraseError = hasVerifyPassphraseError ? "these passphrases don't match, please try again " : '';
    this.setState({ passphraseError, verifyPassphraseError });
    return !passphraseError && !verifyPassphraseError;
  };

  nextAction = () => {
    const { history, location } = this.props;
    const { subMode } = this.state;
    const isWalletOnlySetup = !!location?.state?.withoutNode;
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
    const { passphrase, isLoaderVisible } = this.state;
    if (!isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      try {
        await setTimeout(async () => {
          await generateEncryptionKey({ passphrase });
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

const mapDispatchToProps = {
  generateEncryptionKey,
  saveNewWallet
};

CreateWallet = connect(
  null,
  mapDispatchToProps
)(CreateWallet);

export default CreateWallet;
