// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToContacts, updateTransaction, unlockWallet } from '/redux/wallet/actions';
import styled from 'styled-components';
import { Input, Link, ErrorPopup } from '/basicComponents';
import { smColors } from '/vars';
import type { Action } from '/types';
import { chevronRightBlack } from '/assets/images';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ isStandalone }) => (isStandalone ? '215px' : '100%')};
  height: ${({ isStandalone }) => (isStandalone ? '100%' : '185px')};
  ${({ isStandalone }) => isStandalone && `background-color: ${smColors.purple}; padding: 15px;`}
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 15px;
  line-height: 20px;
  color: ${({ isStandalone }) => (isStandalone ? smColors.white : smColors.realBlack)};
`;

const InputsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: ${({ isStandalone }) => (isStandalone ? 165 : 75)}px;
`;

const InputWrapperUpperPart = styled.div`
  position: absolute;
  top: 0;
  left: ${({ isStandalone }) => (isStandalone ? '0' : '5px')};
  display: flex;
  flex-direction: ${({ isStandalone }) => (isStandalone ? 'column' : 'row')};
  width: ${({ isStandalone }) => (isStandalone ? '100%' : 'calc(100% - 5px)')};
  background-color: ${smColors.purple};
  z-index: 1;
`;

const InputWrapperLowerPart = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: calc(100% - 5px);
  height: 60px;
  border: 1px solid ${smColors.purple};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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

const inputStyle1 = { margin: '10px 10px 10px 10px' };
const inputStyle2 = { margin: '10px 0' };
const inputStyle3 = { marginBottom: '10px' };

type Props = {
  isStandalone: boolean,
  addToContacts: Action,
  updateTransaction: Action,
  unlockWallet: Action,
  initialAddress?: string,
  onCompleteAction: () => void,
  onCancel: () => void
};

type State = {
  address: string,
  initialAddress: string,
  nickname: string,
  hasError: boolean,
  errorMsg: string,
  password: string,
  hasError1: boolean
};

class CreateNewContact extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      address: props.initialAddress || '',
      initialAddress: props.initialAddress || '',
      nickname: '',
      hasError: false,
      errorMsg: '',
      password: '',
      hasError1: false
    };
  }

  render() {
    const { isStandalone, onCancel } = this.props;
    const { address, nickname, hasError, errorMsg, password, hasError1 } = this.state;
    return (
      <Wrapper isStandalone={isStandalone}>
        <Header isStandalone={isStandalone}>
          Create a new contact
          <br />
          --
        </Header>
        <InputsWrapper isStandalone={isStandalone}>
          <InputWrapperUpperPart isStandalone={isStandalone}>
            <Input
              value={nickname}
              placeholder="Nickname"
              onChange={({ value }) => this.setState({ nickname: value, hasError: false })}
              maxLength="50"
              style={isStandalone ? inputStyle2 : inputStyle1}
            />
            <Input
              value={address}
              placeholder="Wallet address"
              onChange={({ value }) => this.setState({ address: value, hasError: false })}
              maxLength="64"
              style={isStandalone ? inputStyle3 : inputStyle1}
              onFocus={this.handleFocus}
            />
            {hasError && <ErrorPopup onClick={() => this.setState({ hasError: false })} text={errorMsg} style={{ bottom: 60, left: 'calc(50% - 90px)' }} />}
          </InputWrapperUpperPart>
          <InputWrapperLowerPart />
        </InputsWrapper>
        <InputSection>
          <Chevron src={chevronRightBlack} />
          <Input type="password" placeholder="ENTER PASSWORD" value={password} onChange={this.handlePasswordTyping} />
          <ErrorSection>
            {hasError1 && <ErrorPopup onClick={() => this.setState({ password: '', hasError1: false })} text="sorry, this password doesn't ring a bell, please try again" />}
          </ErrorSection>
        </InputSection>
        <ButtonsWrapper>
          <Link onClick={onCancel} text="CANCEL" style={{ color: smColors.orange, marginRight: 15 }} />
          <Link onClick={this.createContact} text="CREATE" style={{ color: smColors.green }} />
        </ButtonsWrapper>
      </Wrapper>
    );
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    if (props.initialAddress !== prevState.initialAddress) {
      return { address: props.initialAddress, initialAddress: props.initialAddress };
    }
    return null;
  }

  handleFocus = ({ target }: { target: Object }) => {
    target.select();
  };

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ password: value });
  };

  createContact = async () => {
    const { unlockWallet, addToContacts, onCompleteAction, updateTransaction } = this.props;
    const errorMsg = this.validate();
    if (errorMsg) {
      this.setState({ hasError: true, errorMsg });
    } else {
      const { password, address, nickname } = this.state;
      try {
        await unlockWallet({ password });
        await addToContacts({ password, contact: { address, nickname } });
        updateTransaction({ newData: { address, nickname } });
        onCompleteAction();
      } catch (error) {
        this.setState({ hasError1: true });
      }
    }
  };

  validate = () => {
    const { nickname, address } = this.state;
    const nicknameRegex = /^([a-zA-Z0-9_-])$/;
    if (nicknameRegex.test(nickname)) {
      return 'Nickname is missing or invalid';
    }
    const addressRegex = /\b0[xX][a-zA-Z0-9]{40}\b/;
    if (!addressRegex.test(address)) {
      return 'Address is invalid';
    }
    return '';
  };
}

const mapDispatchToProps = {
  addToContacts,
  updateTransaction,
  unlockWallet
};

CreateNewContact = connect<any, any, _, _, _, _>(null, mapDispatchToProps)(CreateNewContact);

export default CreateNewContact;
