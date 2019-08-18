// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToContacts, updateTransaction } from '/redux/wallet/actions';
import styled from 'styled-components';
import { Input, Link, ErrorPopup } from '/basicComponents';
import { smColors } from '/vars';
import type { Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ isStandalone }) => (isStandalone ? '175px' : '100%')};
  height: ${({ isStandalone }) => (isStandalone ? '100%' : '140px')};
  ${({ isStandalone }) => isStandalone && `background-color: ${smColors.purple}`};
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  color: ${({ isStandalone }) => (isStandalone ? smColors.white : smColors.realBlack)};
`;

const InputsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 75px;
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

const inputStyle1 = { margin: '10px 0 10px 10px' };
const inputStyle2 = { margin: '10px 10px 10px 10px' };

type Props = {
  isStandalone: boolean,
  addToContacts: Action,
  updateTransaction: Action,
  initialAddress?: string,
  onCompleteAction: () => void
};

type State = {
  address: string,
  nickname: string,
  email: string,
  hasError: boolean,
  errorMsg: string
};

class CreateNewContact extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      address: props.initialAddress || '',
      nickname: '',
      email: '',
      hasError: false,
      errorMsg: ''
    };
  }

  render() {
    const { isStandalone, onCompleteAction } = this.props;
    const { address, nickname, email, hasError, errorMsg } = this.state;
    const inputStyle = isStandalone ? inputStyle2 : inputStyle1;
    return (
      <Wrapper isStandalone={isStandalone}>
        <Header isStandalone={isStandalone}>
          Create new contact
          <br />
          --
        </Header>
        <InputsWrapper>
          <InputWrapperUpperPart isStandalone={isStandalone}>
            <Input value={nickname} placeholder="Nickname" onChange={({ value }) => this.setState({ nickname: value, hasError: false })} maxLength="50" style={inputStyle} />
            <Input value={address} placeholder="Wallet address" onChange={({ value }) => this.setState({ address: value, hasError: false })} maxLength="64" style={inputStyle} />
            <Input value={email} placeholder="Email (optional)" onChange={({ value }) => this.setState({ email: value, hasError: false })} maxLength="150" style={inputStyle2} />
            {hasError && <ErrorPopup onClick={() => this.setState({ hasError: false })} text={errorMsg} style={{ bottom: 60, left: 'calc(50% - 90px)' }} />}
          </InputWrapperUpperPart>
          <InputWrapperLowerPart />
        </InputsWrapper>
        <ButtonsWrapper>
          <Link onClick={onCompleteAction} text="CANCEL" style={{ color: smColors.mediumGray, marginRight: 15 }} />
          <Link onClick={this.createContact} text="CREATE" />
        </ButtonsWrapper>
      </Wrapper>
    );
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    if (props.initialAddress && props.initialAddress !== prevState.address) {
      return { address: props.initialAddress };
    }
    return null;
  }

  createContact = async () => {
    const { addToContacts, onCompleteAction, updateTransaction } = this.props;
    const errorMsg = this.validate();
    if (errorMsg) {
      this.setState({ hasError: true, errorMsg });
    } else {
      const { address, nickname, email } = this.state;
      try {
        await addToContacts({ contact: { address, nickname, email } });
        await updateTransaction({ tx: { address, nickname, isSavedContact: true }, updateAll: true });
        onCompleteAction();
      } catch (error) {
        this.setState(() => {
          throw error;
        });
      }
    }
  };

  validate = () => {
    const { nickname, address, email } = this.state;
    const nicknameRegex = /^([a-zA-Z0-9_-])$/;
    if (nicknameRegex.test(nickname)) {
      return 'Nickname is missing or invalid';
    }
    const addressRegex = /\b[a-zA-Z0-9]{64}\b/;
    if (!addressRegex.test(address)) {
      return 'Address is invalid';
    }
    // eslint-disable-next-line no-useless-escape
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!!email && !emailRegex.test(email)) {
      return 'Must enter a valid email';
    }
    return '';
  };
}

const mapDispatchToProps = {
  addToContacts,
  updateTransaction
};

CreateNewContact = connect<any, any, _, _, _, _>(
  null,
  mapDispatchToProps
)(CreateNewContact);

export default CreateNewContact;
