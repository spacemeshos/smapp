import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { deriveEncryptionKey, saveNewWallet } from '/redux/wallet/actions';
import { SmButton, SmInput, Loader } from '/basicComponents';
import { fileSystemService } from '/infra/fileSystemService';
import { miner } from '/assets/images';
import { smColors } from '/vars';
import type { Action } from '/types';
import { shell } from 'electron';

// TODO: For testing purposes, set to 1 minimum length. Should be changed back to 8 when ready.
const passwordMinimumLentgth = 1;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 30px;
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: column;
`;

const GrayText = styled.span`
  font-size: 16px;
  text-align: left;
  color: ${smColors.gray};
  line-height: 29px;
`;

const UpperPartHeader = styled.span`
  font-size: 24px;
  text-align: left;
  color: ${smColors.black};
`;

const Link = styled(GrayText)`
  font-size: 16px;
  text-align: left;
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Image = styled.img`
  max-width: 120px;
  max-height: 100%;
`;

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  deriveEncryptionKey: Action,
  saveNewWallet: Action,
  hideCloseBtn: () => void,
  navigateToLocalNodeSetup: () => void,
  navigateToWallet: () => void,
  mnemonic: string
};

type State = {
  subMode: 1 | 2,
  passphrase: string,
  verifiedPassphrase: string,
  passphraseError: ?string,
  verifyPassphraseError: ?string,
  isLoaderVisible: boolean
};

class CreateWallet extends Component<Props, State> {
  state = {
    subMode: 1,
    passphrase: '',
    verifiedPassphrase: '',
    passphraseError: null,
    verifyPassphraseError: null,
    isLoaderVisible: false
  };

  render() {
    const { isLoaderVisible, subMode } = this.state;
    if (isLoaderVisible) {
      return (
        <LoaderWrapper>
          <Loader size={Loader.sizes.BIG} />
        </LoaderWrapper>
      );
    }
    return subMode === 1 ? this.renderSubStep1() : this.renderSubStep2();
  }

  renderSubStep1 = () => {
    const { passphraseError, verifyPassphraseError } = this.state;
    return (
      <Wrapper>
        <UpperPart>
          <UpperPartHeader>Encrypt your Wallet</UpperPartHeader>
          <GrayText>{`Must be at least ${passwordMinimumLentgth} character${passwordMinimumLentgth > 1 ? 's' : ''}`}</GrayText>
          <SmInput type="password" placeholder="Type passphrase" errorMsg={passphraseError} onEnterPress={this.handleEnterPress} onChange={this.handlePasswordTyping} hasDebounce />
          <SmInput
            type="password"
            placeholder="Verify passphrase"
            errorMsg={verifyPassphraseError}
            onEnterPress={this.handleEnterPress}
            onChange={this.handlePasswordVerifyTyping}
            hasDebounce
          />
          <GrayText>
            Your Wallet file is encrypted and saved on your computer. <Link onClick={this.openWalletBackupDirectory}>Show me the file</Link>
          </GrayText>
        </UpperPart>
        <BottomPart>
          <SmButton text="Next" theme="orange" onPress={this.createWallet} style={{ marginTop: 20 }} />
        </BottomPart>
      </Wrapper>
    );
  };

  renderSubStep2 = () => {
    const { navigateToLocalNodeSetup, navigateToWallet } = this.props;
    return (
      <Wrapper>
        <UpperPart>
          <UpperPartHeader>Setup a Spacemesh Local Node and start earning Spacemesh Coins?</UpperPartHeader>
          <ImageWrapper>
            <Image src={miner} />
          </ImageWrapper>
          <Link onClick={this.navigateToExplanation}>Learn more about Spacemesh local nodes.</Link>
        </UpperPart>
        <BottomPart>
          <SmButton text="Yes, Setup Local Node" theme="orange" onPress={navigateToLocalNodeSetup} style={{ marginTop: 20 }} />
          <SmButton text="Maybe Later" theme="green" onPress={navigateToWallet} style={{ marginTop: 20 }} />
        </BottomPart>
      </Wrapper>
    );
  };

  handleEnterPress = () => {
    const { passphrase, verifiedPassphrase, passphraseError, verifyPassphraseError } = this.state;
    if (!!passphrase || !!verifiedPassphrase || !passphraseError || !verifyPassphraseError) {
      this.createWallet();
    }
  };

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, passphraseError: null });
  };

  handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPassphrase: value, verifyPassphraseError: null });
  };

  validate = () => {
    const { passphrase, verifiedPassphrase } = this.state;
    const hasPassphraseError = !passphrase || (!!passphrase && passphrase.length < passwordMinimumLentgth);
    const hasVerifyPassphraseError = !verifiedPassphrase || passphrase !== verifiedPassphrase;
    const passphraseError = hasPassphraseError ? `Passphrase has to be ${passwordMinimumLentgth} characters or more.` : null;
    const verifyPassphraseError = hasVerifyPassphraseError ? 'Passphrase does not match.' : null;
    this.setState({ passphraseError, verifyPassphraseError });
    return !passphraseError && !verifyPassphraseError;
  };

  createWallet = async () => {
    const { deriveEncryptionKey, saveNewWallet, hideCloseBtn, mnemonic } = this.props;
    const { passphrase, isLoaderVisible } = this.state;
    const canProceed = this.validate();
    if (canProceed && !isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      try {
        await setTimeout(async () => {
          await deriveEncryptionKey({ passphrase });
          saveNewWallet({ mnemonic });
          this.setState({ isLoaderVisible: false, subMode: 2 }, hideCloseBtn);
        }, 500);
      } catch (err) {
        this.setState(() => {
          throw err;
        });
      }
    }
  };

  navigateToExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');

  openWalletBackupDirectory = async () => {
    await fileSystemService.openWalletBackupDirectory();
  };
}

const mapDispatchToProps = {
  deriveEncryptionKey,
  saveNewWallet
};

CreateWallet = connect(
  null,
  mapDispatchToProps
)(CreateWallet);

export default CreateWallet;
