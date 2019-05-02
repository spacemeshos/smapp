// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { deriveEncryptionKey, updateAccountsInFile, openWalletBackupDirectory } from '/redux/wallet/actions';
import { Modal, SmButton, SmInput, Loader } from '/basicComponents';
import { smColors } from '/vars';
import type { Action, Account } from '/types';

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

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  deriveEncryptionKey: Action,
  updateAccountsInFile: Action,
  accounts: Account[],
  openWalletBackupDirectory: Action,
  goBack: () => void
};

type State = {
  passphrase: string,
  verifiedPassphrase: string,
  passphraseError: ?string,
  verifyPassphraseError: ?string,
  isLoaderVisible: boolean
};

class ChangePassphrase extends Component<Props, State> {
  state = {
    passphrase: '',
    verifiedPassphrase: '',
    passphraseError: null,
    verifyPassphraseError: null,
    isLoaderVisible: false
  };

  render() {
    const { goBack } = this.props;
    return <Modal header="Change Passphrase" onCancelBtnClick={goBack} onCloseClick={goBack} content={this.renderModalBody()} />;
  }

  renderModalBody = () => {
    const { openWalletBackupDirectory } = this.props;
    const { isLoaderVisible, passphraseError, verifyPassphraseError } = this.state;
    if (isLoaderVisible) {
      return (
        <LoaderWrapper>
          <Loader size={Loader.sizes.BIG} />
        </LoaderWrapper>
      );
    }
    return (
      <Wrapper>
        <UpperPart>
          <UpperPartHeader>Encrypt your Wallet</UpperPartHeader>
          <GrayText>Must be at least 8 characters</GrayText>
          <SmInput type="password" placeholder="Type passphrase" errorMsg={passphraseError} onChange={this.handlePassphraseTyping} hasDebounce />
          <SmInput type="password" placeholder="Verify passphrase" errorMsg={verifyPassphraseError} onChange={this.handlePassphraseVerifyTyping} hasDebounce />
          <GrayText>
            Your Wallet file is encrypted and saved on your computer. <Link onClick={openWalletBackupDirectory}>Show me the file</Link>
          </GrayText>
        </UpperPart>
        <BottomPart>
          <SmButton text="Next" theme="orange" onPress={this.updatePassphrase} style={{ marginTop: 20 }} />
        </BottomPart>
      </Wrapper>
    );
  };

  handlePassphraseTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, passphraseError: null });
  };

  handlePassphraseVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPassphrase: value, verifyPassphraseError: null });
  };

  validate = () => {
    const { passphrase, verifiedPassphrase } = this.state;
    const hasPassphraseError = !passphrase || (!!passphrase && passphrase.length < 8);
    const hasVerifyPassphraseError = !verifiedPassphrase || passphrase !== verifiedPassphrase;
    const passphraseError = hasPassphraseError ? 'Passphrase has to be 8 characters or more.' : null;
    const verifyPassphraseError = hasVerifyPassphraseError ? 'Passphrase does not match.' : null;
    this.setState({ passphraseError, verifyPassphraseError });
    return !passphraseError && !verifyPassphraseError;
  };

  updatePassphrase = async () => {
    const { deriveEncryptionKey, updateAccountsInFile, accounts, goBack } = this.props;
    const { passphrase, isLoaderVisible } = this.state;
    const canProceed = this.validate();
    if (canProceed && !isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      await setTimeout(async () => {
        deriveEncryptionKey({ passphrase });
        await updateAccountsInFile({ accounts });
        goBack();
      }, 500);
    }
  };
}

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  deriveEncryptionKey,
  updateAccountsInFile,
  openWalletBackupDirectory
};

ChangePassphrase = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassphrase);

export default ChangePassphrase;
