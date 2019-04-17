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
  emailErrorMsg: null,
  renderKey: 0,
  isPublicAddressReadOnly: false
};

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
  errorFieldName: string,
  defaultValue?: string,
  errorMsg: ?string,
  isDisabled?: boolean
};

type Props = {
  modalMode?: boolean,
  publicWalletAddress?: string,
  onSave: Function
};

type State = {
  publicWalletAddress: string,
  nickname: string,
  email?: string,
  addressErrorMsg: ?string,
  nicknameErrorMsg: ?string,
  emailErrorMsg: ?string,
  renderKey: number,
  isPublicAddressReadOnly: boolean
};

class AddNewContact extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initialState,
      publicWalletAddress: props.publicWalletAddress,
      isPublicAddressReadOnly: !!props.publicWalletAddress
    };
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
        {this.renderFields()}
        <ButtonWrapper alignment={modalMode ? 'right' : 'left'}>
          <SmButton text="Save to contacts" isDisabled={isSaveButtonDisabled} theme="orange" onPress={this.handleSave} style={{ width: 164 }} />
        </ButtonWrapper>
      </Wrapper>
    );
  }

  renderFields = () => {
    const { publicWalletAddress, addressErrorMsg, nicknameErrorMsg, emailErrorMsg, isPublicAddressReadOnly } = this.state;
    const fields: Field[] = [
      {
        title: 'Public wallet address',
        placeholder: 'Type public wallet address',
        fieldName: 'publicWalletAddress',
        errorFieldName: 'addressErrorMsg',
        defaultValue: publicWalletAddress,
        errorMsg: addressErrorMsg,
        isDisabled: isPublicAddressReadOnly
      },
      {
        title: 'Nickname',
        placeholder: 'Type nickname',
        fieldName: 'nickname',
        errorFieldName: 'nicknameErrorMsg',
        errorMsg: nicknameErrorMsg
      },
      {
        title: 'Email (optional)',
        placeholder: 'Type email',
        fieldName: 'email',
        errorFieldName: 'emailErrorMsg',
        errorMsg: emailErrorMsg
      }
    ];
    return <React.Fragment>{fields.map((field: Field) => this.renderSingleField(field))}</React.Fragment>;
  };

  renderSingleField = ({ title, placeholder, fieldName, errorFieldName, errorMsg, defaultValue, isDisabled }: Field) => {
    return (
      <FieldWrapper key={fieldName}>
        <TextWrapper>
          <BoldText>{title}</BoldText>
        </TextWrapper>
        <SmInput
          type="text"
          isDisabled={isDisabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          errorMsg={errorMsg}
          onChange={({ value }) => this.handleTyping({ value, fieldName, errorFieldName })}
        />
      </FieldWrapper>
    );
  };

  handleTyping = ({ value, fieldName, errorFieldName }: { value: string, fieldName: string, errorFieldName: string }) => {
    this.setState({ [fieldName]: value, [errorFieldName]: getErrorMessage({ fieldName, value }) });
  };

  handleSave = () => {
    const { onSave } = this.props;
    const { publicWalletAddress, nickname, email, renderKey } = this.state;
    onSave({ publicWalletAddress, nickname, email });
    this.setState({ ...initialState, renderKey: renderKey + 1 });
  };
}

export default AddNewContact;
