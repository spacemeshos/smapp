// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addToContacts } from '/redux/wallet/actions';
import styled from 'styled-components';
import { SmButton, SmInput } from '/basicComponents';
import { smColors } from '/vars';
import type { Action, Contact } from '/types';

const initialState = {
  publicWalletAddress: '',
  nickname: '',
  email: '',
  addressErrorMsg: null,
  nicknameErrorMsg: null,
  emailErrorMsg: null,
  renderKey: 0
};

const errorMessages = {
  publicWalletAddress: 'Address is invalid',
  nickname: 'Nickname is required',
  email: 'Must enter a valid email'
};

const fields: Field[] = [
  {
    title: 'Public wallet address',
    placeholder: 'Type public wallet address',
    fieldName: 'publicWalletAddress',
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

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  ${({ showBorder }) =>
    showBorder &&
    `
    border: 1px solid ${smColors.borderGray}
  `}
  padding: 36px 22px;
`;

const FieldWrapper = styled.div`
  margin-bottom: 28px;
`;

const TextWrapper = styled.div`
  margin-bottom: 16px;
`;

const BoldText = styled.span`
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: ${smColors.lighterBlack};
`;

const TitleWrapper = styled.div`
  margin-bottom: 32px;
`;

const Title = styled(BoldText)`
  color: ${smColors.darkGray};
`;

// $FlowStyledIssue
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ alignment }) => (alignment === 'right' ? 'flex-end' : 'flex-right')};
`;

type Field = {
  title: string,
  placeholder: string,
  fieldName: string,
  errorFieldName: string
};

type Props = {
  modalMode?: boolean,
  addToContacts: Action,
  publicWalletAddress?: string,
  onSave: ({ publicWalletAddress: string, nickname: string, email?: string }) => void
};

type State = {
  publicWalletAddress: string,
  nickname: string,
  email?: string,
  addressErrorMsg: ?string,
  nicknameErrorMsg: ?string,
  emailErrorMsg: ?string,
  renderKey: number
};

class AddNewContact extends Component<Props, State> {
  state = { ...initialState };

  static getDerivedStateFromProps(props, prevState) {
    if (props.publicWalletAddress && !prevState.publicWalletAddress) {
      return { publicWalletAddress: props.publicWalletAddress };
    }
    return null;
  }

  render() {
    const { modalMode } = this.props;
    const { publicWalletAddress, nickname, addressErrorMsg, nicknameErrorMsg, emailErrorMsg, renderKey } = this.state;
    const isSaveButtonDisabled = !publicWalletAddress || !nickname || !!addressErrorMsg || !!nicknameErrorMsg || !!emailErrorMsg;
    return (
      <Wrapper showBorder={!modalMode} key={`render_key_${renderKey}`}>
        {!modalMode && (
          <TitleWrapper>
            <Title>Add New Contact</Title>
          </TitleWrapper>
        )}
        <React.Fragment>{fields.map((field: Field) => this.renderSingleField(field))}</React.Fragment>
        <ButtonWrapper alignment={modalMode ? 'right' : 'left'}>
          <SmButton text="Save to contacts" isDisabled={isSaveButtonDisabled} theme="orange" onPress={this.handleSave} style={{ width: 164 }} />
        </ButtonWrapper>
      </Wrapper>
    );
  }

  renderSingleField = ({ title, placeholder, fieldName, errorFieldName }: Field) => {
    const { publicWalletAddress } = this.props;
    const isAddToContactsMode = fieldName === 'publicWalletAddress' && !!publicWalletAddress;
    return (
      <FieldWrapper key={fieldName}>
        <TextWrapper>
          <BoldText>{title}</BoldText>
        </TextWrapper>
        <SmInput
          type="text"
          isDisabled={isAddToContactsMode}
          placeholder={placeholder}
          defaultValue={isAddToContactsMode ? publicWalletAddress : ''}
          // eslint-disable-next-line react/destructuring-assignment
          errorMsg={this.state[errorFieldName]}
          onChange={({ value }) => this.handleTyping({ value, fieldName, errorFieldName })}
        />
      </FieldWrapper>
    );
  };

  getErrorMessage = ({ fieldName, value }: { fieldName: string, value: string }): ?string => (this.validators({ fieldName, value }) ? null : errorMessages[fieldName]);

  handleTyping = ({ value, fieldName, errorFieldName }: { value: string, fieldName: string, errorFieldName: string }) => {
    this.setState({ [fieldName]: value, [errorFieldName]: this.getErrorMessage({ fieldName, value }) });
  };

  handleSave = () => {
    const { addToContacts, onSave } = this.props;
    const { publicWalletAddress, nickname, email, renderKey } = this.state;
    const contact: Contact = {
      publicWalletAddress,
      nickname,
      email
    };
    addToContacts({ contact });
    this.setState({ ...initialState, renderKey: renderKey + 1 });
    onSave && onSave({ publicWalletAddress, nickname, email });
  };

  validators = ({ fieldName, value }: { fieldName: string, value: string }) => {
    switch (fieldName) {
      case 'publicWalletAddress': {
        const addressRegex = /\b[a-zA-Z0-9]{64}\b/;
        return addressRegex.test(value);
      }
      case 'nickname': {
        const nicknameRegex = /^([a-zA-Z0-9_-]){1,50}$/;
        return nicknameRegex.test(value);
      }
      case 'email': {
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !value || emailRegex.test(value);
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
