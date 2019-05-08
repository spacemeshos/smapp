// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToContacts } from '/redux/wallet/actions';
import styled from 'styled-components';
import { SmButton, SmInput } from '/basicComponents';
import { smColors } from '/vars';
import type { Action } from '/types';

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  border: 1px solid ${({ hasBorder }) => (hasBorder ? smColors.borderGray : 'transparent')};
  padding: 35px 20px;
`;

const Title = styled.div`
  margin-bottom: 30px;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: ${smColors.darkGray};
`;

const FieldWrapper = styled.div`
  margin-bottom: 30px;
`;

const FieldTitle = styled.div`
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: ${smColors.lighterBlack};
`;

// $FlowStyledIssue
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ alignment }) => (alignment === 'right' ? 'flex-end' : 'flex-right')};
`;

type Props = {
  isModalMode?: boolean,
  addToContacts: Action,
  defaultAddress?: string,
  onSave: ({ address: string, nickname: string, email?: string }) => void
};

type State = {
  address: string,
  nickname: string,
  email?: string,
  addressErrorMsg?: string,
  nicknameErrorMsg?: string,
  emailErrorMsg?: string,
  renderKey: number
};

class AddNewContact extends Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  fields = [
    {
      title: 'Public wallet address',
      placeholder: 'Type public wallet address',
      fieldName: 'address',
      errorFieldName: 'addressErrorMsg'
    },
    {
      title: 'Nickname',
      placeholder: 'Type nickname',
      fieldName: 'nickname',
      errorFieldName: 'nicknameErrorMsg'
    },
    {
      title: 'Email (optional)',
      placeholder: 'Type email',
      fieldName: 'email',
      errorFieldName: 'emailErrorMsg'
    }
  ];

  initialState = {
    address: '',
    nickname: '',
    email: '',
    addressErrorMsg: '',
    nicknameErrorMsg: '',
    emailErrorMsg: '',
    renderKey: 0
  };

  state = { ...this.initialState };

  static getDerivedStateFromProps(props, prevState) {
    if (props.defaultAddress && props.defaultAddress !== prevState.address) {
      return { address: props.defaultAddress, renderKey: prevState.renderKey + 1, addressErrorMsg: '' };
    }
    return null;
  }

  render() {
    const { isModalMode } = this.props;
    const { address, nickname, addressErrorMsg, nicknameErrorMsg, emailErrorMsg, renderKey } = this.state;
    const isSaveButtonDisabled = !address || !nickname || !!addressErrorMsg || !!nicknameErrorMsg || !!emailErrorMsg;
    return (
      <Wrapper hasBorder={!isModalMode} key={`render_key_${renderKey}`}>
        {!isModalMode && <Title>Add New Contact</Title>}
        {this.renderFields()}
        <ButtonWrapper alignment={isModalMode ? 'right' : 'left'}>
          <SmButton text="Save to contacts" isDisabled={isSaveButtonDisabled} theme="orange" onPress={this.handleSave} style={{ width: 164 }} />
        </ButtonWrapper>
      </Wrapper>
    );
  }

  renderFields = () => {
    const { defaultAddress } = this.props;
    return this.fields.map(({ title, placeholder, fieldName, errorFieldName }) => {
      const isAddToContactsMode = fieldName === 'address' && !!defaultAddress;
      return (
        <FieldWrapper key={fieldName}>
          <FieldTitle>{title}</FieldTitle>
          <SmInput
            isDisabled={isAddToContactsMode}
            placeholder={placeholder}
            defaultValue={isAddToContactsMode ? defaultAddress : ''}
            errorMsg={this.state[errorFieldName]} // eslint-disable-line react/destructuring-assignment
            onChange={({ value }) => this.handleTyping({ value, fieldName, errorFieldName })}
          />
        </FieldWrapper>
      );
    });
  };

  handleTyping = ({ value, fieldName, errorFieldName }: { value: string, fieldName: string, errorFieldName: string }) => {
    this.setState({ [fieldName]: value, [errorFieldName]: this.validate({ fieldName, value }) });
  };

  handleSave = () => {
    const { addToContacts, onSave } = this.props;
    const { address, nickname, email, renderKey } = this.state;
    addToContacts({ contact: { address, nickname, email } });
    this.setState({ ...this.initialState, renderKey: renderKey + 1 });
    onSave && onSave({ address, nickname, email });
  };

  validate = ({ fieldName, value }: { fieldName: string, value: string }) => {
    switch (fieldName) {
      case 'address': {
        const addressRegex = /\b[a-zA-Z0-9]{64}\b/;
        return addressRegex.test(value) ? '' : 'Address is invalid';
      }
      case 'nickname': {
        const nicknameRegex = /^([a-zA-Z0-9_-]){1,50}$/;
        return nicknameRegex.test(value) ? '' : 'Nickname is required';
      }
      case 'email': {
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !value || emailRegex.test(value) ? '' : 'Must enter a valid email';
      }
      default:
        return false;
    }
  };
}

const mapDispatchToProps = {
  addToContacts
};

AddNewContact = connect(
  null,
  mapDispatchToProps
)(AddNewContact);

export default AddNewContact;
