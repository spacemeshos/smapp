// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { deriveEncryptionKey, updateAccountsInFile } from '/redux/wallet/actions';
import { ErrorPopup, Input, Link, Loader } from '/basicComponents';
import { smColors } from '/vars';
import type { Action, Account } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const LeftPart = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const RightPart = styled.div`
  display: flex;
  flex-direction: row;
  flex: 2;
  justify-content: flex-end;
  align-items: center;
`;

type Props = {
  deriveEncryptionKey: Action,
  updateAccountsInFile: Action,
  accounts: Account[],
  goBack: () => void
};

type State = {
  isEditMode: boolean,
  passphrase: string,
  verifiedPassphrase: string,
  passphraseError: string,
  verifyPassphraseError: string,
  isLoaderVisible: boolean
};

class ChangePassphrase extends Component<Props, State> {
  timeOut: any;

  state = {
    isEditMode: false,
    passphrase: '',
    verifiedPassphrase: '',
    passphraseError: '',
    verifyPassphraseError: '',
    isLoaderVisible: false
  };

  render() {
    const { isEditMode, passphrase, verifiedPassphrase, isLoaderVisible, passphraseError, verifyPassphraseError } = this.state;
    if (isLoaderVisible) {
      return <Loader size={Loader.sizes.BIG} />;
    }
    return (
      <Wrapper>
        <LeftPart>
          {isEditMode ? (
            [
              <Input value={passphrase} type="password" placeholder="Type passphrase" onChange={this.handlePasswordTyping} style={{ marginBottom: 15 }} key="pass" />,
              <Input value={verifiedPassphrase} type="password" placeholder="Verify passphrase" onChange={this.handlePasswordVerifyTyping} key="passRetype" />
            ]
          ) : (
            <Input value="***********" type="password" isDisabled />
          )}
          {(!!passphraseError || !!verifyPassphraseError) && (
            <ErrorPopup
              onClick={() => this.setState({ passphraseError: '', verifyPassphraseError: '' })}
              text={passphraseError || verifyPassphraseError}
              style={{ top: '95px', right: '-30px' }}
            />
          )}
        </LeftPart>
        <RightPart>
          {isEditMode ? (
            [
              <Link onClick={this.updatePassphrase} text="SAVE" style={{ marginRight: 15 }} key="change" />,
              <Link onClick={this.cancelUpdatingPassphrase} text="CANCEL" style={{ color: smColors.darkGray }} key="cancel" />
            ]
          ) : (
            <Link onClick={this.startUpdatingPassphrase} text="CHANGE" />
          )}
        </RightPart>
      </Wrapper>
    );
  }

  componentWillUnmount() {
    this.timeOut && clearTimeout(this.timeOut);
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ passphrase: value, passphraseError: '' });
  };

  handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPassphrase: value, verifyPassphraseError: '' });
  };

  startUpdatingPassphrase = () => this.setState({ isEditMode: true });

  cancelUpdatingPassphrase = () => {
    this.setState({ passphrase: '', isEditMode: false, passphraseError: '', verifyPassphraseError: '' });
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

  updatePassphrase = async () => {
    const { deriveEncryptionKey, updateAccountsInFile, accounts, goBack } = this.props;
    const { passphrase, isLoaderVisible } = this.state;
    if (this.validate() && !isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      try {
        this.timeOut = await setTimeout(async () => {
          deriveEncryptionKey({ passphrase });
          await updateAccountsInFile({ accounts });
          goBack();
        }, 500);
      } catch (error) {
        this.setState(() => {
          throw error;
        });
      }
    }
  };
}

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  deriveEncryptionKey,
  updateAccountsInFile
};

ChangePassphrase = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(ChangePassphrase);

export default ChangePassphrase;
