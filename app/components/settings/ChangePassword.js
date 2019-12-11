// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { generateEncryptionKey, updateAccountsInFile } from '/redux/wallet/actions';
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
  generateEncryptionKey: Action,
  updateAccountsInFile: Action,
  accounts: Account[]
};

type State = {
  isEditMode: boolean,
  password: string,
  verifiedPassword: string,
  passwordError: string,
  verifyPasswordError: string,
  isLoaderVisible: boolean
};

class ChangePassword extends Component<Props, State> {
  timeOut: TimeoutID;

  state = {
    isEditMode: false,
    password: '',
    verifiedPassword: '',
    passwordError: '',
    verifyPasswordError: '',
    isLoaderVisible: false
  };

  render() {
    const { isEditMode, password, verifiedPassword, isLoaderVisible, passwordError, verifyPasswordError } = this.state;
    if (isLoaderVisible) {
      return <Loader size={Loader.sizes.BIG} />;
    }
    return (
      <Wrapper>
        <LeftPart>
          {isEditMode ? (
            [
              <Input value={password} type="password" placeholder="Type password" onChange={this.handlePasswordTyping} style={{ marginBottom: 15 }} key="pass" />,
              <Input value={verifiedPassword} type="password" placeholder="Verify password" onChange={this.handlePasswordVerifyTyping} key="passRetype" />
            ]
          ) : (
            <Input value="***********" type="password" isDisabled />
          )}
          {(!!passwordError || !!verifyPasswordError) && (
            <ErrorPopup
              onClick={() => this.setState({ passwordError: '', verifyPasswordError: '' })}
              text={passwordError || verifyPasswordError}
              style={{ top: '95px', right: '-30px' }}
            />
          )}
        </LeftPart>
        <RightPart>
          {isEditMode ? (
            [
              <Link onClick={this.updatePassword} text="SAVE" style={{ marginRight: 15 }} key="change" />,
              <Link onClick={this.clearFields} text="CANCEL" style={{ color: smColors.darkGray }} key="cancel" />
            ]
          ) : (
            <Link onClick={this.startUpdatingPassword} text="CHANGE" />
          )}
        </RightPart>
      </Wrapper>
    );
  }

  componentWillUnmount() {
    this.timeOut && clearTimeout(this.timeOut);
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ password: value, passwordError: '' });
  };

  handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    this.setState({ verifiedPassword: value, verifyPasswordError: '' });
  };

  startUpdatingPassword = () => this.setState({ isEditMode: true });

  clearFields = () => {
    this.setState({ password: '', verifiedPassword: '', isEditMode: false, passwordError: '', verifyPasswordError: '', isLoaderVisible: false });
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

  updatePassword = async () => {
    const { generateEncryptionKey, updateAccountsInFile, accounts } = this.props;
    const { password, isLoaderVisible } = this.state;
    if (this.validate() && !isLoaderVisible) {
      this.setState({ isLoaderVisible: true });
      try {
        this.timeOut = await setTimeout(async () => {
          generateEncryptionKey({ password });
          await updateAccountsInFile({ accounts });
          this.clearFields();
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
  generateEncryptionKey,
  updateAccountsInFile
};

ChangePassword = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(ChangePassword);

export default ChangePassword;
