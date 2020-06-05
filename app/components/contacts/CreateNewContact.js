// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToContacts, updateTransaction } from '/redux/wallet/actions';
import styled from 'styled-components';
import { Input, ErrorPopup, Button } from '/basicComponents';
import { smColors } from '/vars';
import type { Action } from '/types';

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
  position: relative;
  top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const inputStyle1 = { margin: '10px 10px 10px 10px' };
const inputStyle2 = { margin: '10px 0' };
const inputStyle3 = { marginBottom: '10px' };

type Props = {
  isStandalone: boolean,
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
  errorMsg: string
};

class CreateNewContact extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      address: props.initialAddress || '',
      initialAddress: props.initialAddress || '',
      nickname: '',
      hasError: false,
      errorMsg: ''
    };
  }

  render() {
    const { isStandalone, onCancel } = this.props;
    const { address, nickname, hasError, errorMsg } = this.state;
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
          <Button onClick={onCancel} text="CANCEL" style={{ color: smColors.disabledGray, marginRight: 15 }} />
          <Button onClick={this.createContact} text="CREATE" style={{ color: smColors.white }} />
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

  createContact = async () => {
    const { addToContacts, onCompleteAction, updateTransaction } = this.props;
    const errorMsg = this.validate();
    if (errorMsg) {
      this.setState({ hasError: true, errorMsg });
    } else {
      const { address, nickname } = this.state;
      try {
        await addToContacts({ contact: { address, nickname } });
        updateTransaction({ messageType: 'update-contact', newData: { address, nickname } });
        onCompleteAction();
      } catch (error) {
        this.setState(() => {
          throw error;
        });
      }
    }
  };

  validate = () => {
    const { nickname, address } = this.state;
    const nicknameRegex = /^([a-zA-Z0-9_-])$/;
    if (nicknameRegex.test(nickname)) {
      return 'Nickname is missing or invalid';
    }
    const addressRegex = /\b[a-zA-Z0-9]{42}\b/;
    if (!addressRegex.test(address)) {
      return 'Address is invalid';
    }
    return '';
  };
}

const mapDispatchToProps = {
  addToContacts,
  updateTransaction
};

CreateNewContact = connect<any, any, _, _, _, _>(null, mapDispatchToProps)(CreateNewContact);

export default CreateNewContact;
