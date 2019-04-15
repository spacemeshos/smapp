// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { SmButton, SmInput } from '/basicComponents';
import { smColors } from '/vars';

const validateEmail = (email = '') => {
  // eslint-disable-next-line no-useless-escape
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !email || emailRegex.test(email);
};

const validateAddress = (publicWalletAddress: string) => {
  const addressRegex = /\b[a-zA-Z0-9]{64}\b/;
  return addressRegex.test(publicWalletAddress);
};

const validateNickname = (nickname: string) => {
  const nicknameRegex = /^([a-zA-Z0-9_-]){1,50}$/;
  return nicknameRegex.test(nickname);
};

const getErrorMessage = ({ fieldName, value }: { fieldName: string, value: string }) => {
  const errorMessages = {
    publicWalletAddress: 'Address is invalid',
    nickname: 'Nickname is required',
    email: 'Must enter a valid email'
  };
  const validators = {
    publicWalletAddress: validateAddress,
    nickname: validateNickname,
    email: validateEmail
  };
  return validators[fieldName](value) ? null : errorMessages[fieldName];
};

const initialState = {
  publicWalletAddress: '',
  nickname: '',
  email: '',
  addressErrorMsg: null,
  nicknameErrorMsg: null,
  emailErrorMsg: null
};

// $FlowStyledIssue
const Wrapper = styled.div`
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
  value?: string,
  placeholder: string,
  fieldName: string,
  errorFieldName: string,
  errorMsg: ?string
};

type Props = {
  modalMode?: boolean,
  publicWalletAddress?: string,
  nickname?: string,
  email?: string,
  onSave: Function
};

type State = {
  publicWalletAddress: string,
  nickname: string,
  email?: string,
  addressErrorMsg: ?string,
  nicknameErrorMsg: ?string,
  emailErrorMsg: ?string
};

class AddNewContact extends Component<Props, State> {
  // state = { ...initialState };
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initialState,
      publicWalletAddress: props.publicWalletAddress,
      nickname: props.nickname,
      email: props.email
    };
  }

  render() {
    const { modalMode } = this.props;
    const { publicWalletAddress, nickname, addressErrorMsg, nicknameErrorMsg, emailErrorMsg } = this.state;
    const isSaveButtonDisabled = !publicWalletAddress || !nickname || !!addressErrorMsg || !!nicknameErrorMsg || !!emailErrorMsg;
    return (
      <Wrapper showBorder={!modalMode}>
        {!modalMode && (
          <TitleWrapper>
            <Title>Add New Contact</Title>
          </TitleWrapper>
        )}
        {this.renderFields()}
        <ButtonWrapper alignment={modalMode ? 'right' : 'left'}>
          <SmButton text="Save to contacts" isDisabled={isSaveButtonDisabled} theme="orange" onPress={this.handleSave} style={{ width: 164 }} />
        </ButtonWrapper>
      </Wrapper>
    );
  }

  renderFields = () => {
    const { publicWalletAddress, nickname, email, addressErrorMsg, nicknameErrorMsg, emailErrorMsg } = this.state;
    const fields: Field[] = [
      {
        title: 'Public wallet address',
        value: publicWalletAddress,
        placeholder: 'Type public wallet address',
        fieldName: 'publicWalletAddress',
        errorFieldName: 'addressErrorMsg',
        errorMsg: addressErrorMsg
      },
      {
        title: 'Nickname',
        value: nickname,
        placeholder: 'Type nickname',
        fieldName: 'nickname',
        errorFieldName: 'nicknameErrorMsg',
        errorMsg: nicknameErrorMsg
      },
      {
        title: 'Email (optional)',
        value: email,
        placeholder: 'Type email',
        fieldName: 'email',
        errorFieldName: 'emailErrorMsg',
        errorMsg: emailErrorMsg
      }
    ];
    return <React.Fragment>{fields.map((field: Field) => this.renderSingleField(field))}</React.Fragment>;
  };

  renderSingleField = ({ title, value, placeholder, fieldName, errorFieldName, errorMsg }: Field) => {
    return (
      <FieldWrapper key={fieldName}>
        <TextWrapper>
          <BoldText>{title}</BoldText>
        </TextWrapper>
        <SmInput type="text" placeholder={placeholder} value={value} errorMsg={errorMsg} onChange={({ value }) => this.handleTyping({ value, fieldName, errorFieldName })} />
      </FieldWrapper>
    );
  };

  handleTyping = ({ value, fieldName, errorFieldName }: { value: string, fieldName: string, errorFieldName: string }) => {
    this.setState({ [fieldName]: value, [errorFieldName]: getErrorMessage({ fieldName, value }) });
  };

  handleSave = () => {
    const { onSave } = this.props;
    const { publicWalletAddress, nickname, email } = this.state;
    onSave({ publicWalletAddress, nickname, email });
    this.setState({ ...initialState });
  };
}

export default AddNewContact;
