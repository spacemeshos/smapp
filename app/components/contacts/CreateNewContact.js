// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToContacts, updateTransaction } from '/redux/wallet/actions';
import styled from 'styled-components';
import { EnterPasswordModal } from '/components/settings';
import { Input, Link, ErrorPopup } from '/basicComponents';
import { smColors } from '/vars';
import type { Action, Contact } from '/types';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const color = isDarkModeOn ? smColors.white : smColors.realBlack;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ isStandalone }) => (isStandalone ? '215px' : '100%')};
  height: ${({ isStandalone }) => (isStandalone ? '100%' : '140px')};
  ${({ isStandalone }) => isStandalone && `background-color: ${smColors.purple}; padding: 15px;`}
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 15px;
  line-height: 20px;
  color: ${({ isStandalone }) => (isStandalone ? smColors.white : color)};
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

const inputStyle1 = { margin: '10px 10px 10px 10px' };
const inputStyle2 = { margin: '10px 0' };
const inputStyle3 = { marginBottom: '10px' };

type Props = {
  isStandalone: boolean,
  contacts: Contact[],
  addToContacts: Action,
  updateTransaction: Action,
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
  shouldShowPasswordModal: boolean
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
      shouldShowPasswordModal: false
    };
  }

  render() {
    const { isStandalone, onCancel } = this.props;
    const { address, nickname, hasError, errorMsg, shouldShowPasswordModal } = this.state;
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
        <ButtonsWrapper>
          <Link onClick={onCancel} text="CANCEL" style={{ color: smColors.orange, marginRight: 15 }} />
          <Link onClick={this.preCreateContact} text="CREATE" style={{ color: smColors.green }} />
        </ButtonsWrapper>
        {shouldShowPasswordModal && <EnterPasswordModal submitAction={this.createContact} closeModal={() => this.setState({ shouldShowPasswordModal: false })} />}
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

  preCreateContact = () => {
    const errorMsg = this.validate();
    if (errorMsg) {
      this.setState({ hasError: true, errorMsg });
    } else {
      this.setState({ shouldShowPasswordModal: true });
    }
  };

  createContact = async ({ password }: { password: string }) => {
    const { addToContacts, onCompleteAction, updateTransaction } = this.props;
    const { address, nickname } = this.state;
    await addToContacts({ password, contact: { address, nickname } });
    updateTransaction({ newData: { address, nickname } });
    onCompleteAction();
  };

  validate = () => {
    const { contacts } = this.props;
    const { nickname, address } = this.state;
    const nicknameRegex = /^([a-zA-Z0-9_-])$/;
    if (nicknameRegex.test(nickname)) {
      return 'Nickname is missing or invalid';
    }
    const addressRegex = /\b0[xX][a-zA-Z0-9]{40}\b/;
    if (!addressRegex.test(address)) {
      return 'Address is invalid';
    }
    let retVal = '';
    contacts.forEach((contact) => {
      if (contact.nickname === nickname) {
        retVal = 'Nickname should be unique';
      }
    });
    return retVal;
  };
}

const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts
});

const mapDispatchToProps = {
  addToContacts,
  updateTransaction
};

CreateNewContact = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(CreateNewContact);

export default CreateNewContact;
