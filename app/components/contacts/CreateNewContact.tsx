import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addToContacts } from '../../redux/wallet/actions';
import { EnterPasswordModal } from '../settings';
import { Input, Link, ErrorPopup, BoldText } from '../../basicComponents';
import { smColors } from '../../vars';
import { AppThDispatch, RootState } from '../../types';
import { validateAddress } from '../../infra/utils';

const Wrapper = styled.div<{ isStandalone: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ isStandalone }) => (isStandalone ? '215px' : '100%')};
  height: ${({ isStandalone }) => (isStandalone ? '100%' : '140px')};
  ${({ isStandalone }) =>
    isStandalone && `background-color: ${smColors.purple}; padding: 15px;`}
`;

const Header = styled(BoldText)<{ isStandalone: boolean }>`
  font-size: 15px;
  line-height: 20px;
  color: ${({ isStandalone, theme }) => {
    if (isStandalone) {
      return smColors.white;
    } else {
      return theme.color.contrast;
    }
  }};
`;

const InputsWrapper = styled.div<{ isStandalone: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ isStandalone }) => (isStandalone ? 165 : 75)}px;
`;

const InputWrapperUpperPart = styled.div<{ isStandalone: boolean }>`
  position: absolute;
  top: 0;
  left: ${({ isStandalone }) => (isStandalone ? '0' : '5px')};
  display: flex;
  flex-direction: ${({ isStandalone }) => (isStandalone ? 'column' : 'row')};
  width: ${({ isStandalone }) => (isStandalone ? '100%' : 'calc(100% - 5px)')};
  background-color: ${smColors.purple};
  z-index: 1;
  ${({ theme: { form } }) => ` border-radius: ${form.input.boxRadius}px;`}
`;

const InputWrapperLowerPart = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: calc(100% - 5px);
  height: 60px;
  ${({ theme }) => `
  border: ${Number(theme.themeName !== 'modern')}px solid ${smColors.purple};`}
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
  isStandalone?: boolean;
  initialAddress?: string;
  onCompleteAction: () => void;
  onCancel: () => void;
};

type ValidateError = {
  type: 'address' | 'name';
  message: string;
};
const CreateNewContact = ({
  isStandalone = false,
  initialAddress = '',
  onCompleteAction,
  onCancel,
}: Props) => {
  const [address, setAddress] = useState(initialAddress || '');
  // const [initialAddress, setIn] = useState(initialAddress || '');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<ValidateError | null>();
  const [shouldShowPasswordModal, setShouldShowPasswordModal] = useState(false);

  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  const dispatch: AppThDispatch = useDispatch();

  // static getDerivedStateFromProps(props: Props, prevState: State) {
  //   if (props.initialAddress !== prevState.initialAddress) {
  //     return { address: props.initialAddress, initialAddress: props.initialAddress };
  //   }
  //   return null;
  // }

  const handleFocus = ({ target }: { target: EventTarget | null }) => {
    // @ts-ignore
    target?.select();
  };

  const validate = (): ValidateError | null => {
    const nicknameRegex = /^([a-zA-Z0-9_-])$/;
    if (nicknameRegex.test(nickname)) {
      return {
        type: 'name',
        message: `Nickname: ${nickname} is missing or invalid`,
      };
    }
    if (contacts.some((contact) => contact.nickname === nickname)) {
      return {
        type: 'name',
        message: `Nickname should be unique, ${nickname} already in contacts`,
      };
    }
    if (!validateAddress(address)) {
      return { type: 'address', message: `Address: ${address} is invalid` };
    }
    const repeatedAddress = contacts.find(
      (contact) => contact.address === address
    );
    if (repeatedAddress) {
      return {
        type: 'address',
        message: `Contact ${repeatedAddress.nickname} has the same address`,
      };
    }
    return null;
  };

  const preCreateContact = () => {
    const error = validate();
    if (error) {
      setError(error);
    } else {
      setShouldShowPasswordModal(true);
    }
  };

  const createContact = async ({ password }: { password: string }) => {
    dispatch(addToContacts({ password, contact: { address, nickname } }));
    onCompleteAction();
  };

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
            onChange={({ value }) => {
              setNickname(value);
              setError(null);
            }}
            maxLength="50"
            style={isStandalone ? inputStyle2 : inputStyle1}
            autofocus
          />
          <Input
            value={address}
            placeholder="Account address"
            onChange={({ value }) => {
              setAddress(value);
              setError(null);
            }}
            maxLength="90"
            style={isStandalone ? inputStyle3 : inputStyle1}
            onFocus={handleFocus}
          />
          {error && (
            <ErrorPopup
              onClick={() => setError(null)}
              text={error.message.toUpperCase()}
              style={{
                bottom: -33,
                left:
                  error.type === 'name'
                    ? 'calc(0% + 10px)'
                    : 'calc(50% + 10px)',
              }}
            />
          )}
        </InputWrapperUpperPart>
        <InputWrapperLowerPart />
      </InputsWrapper>
      <ButtonsWrapper>
        <Link
          onClick={preCreateContact}
          text="CREATE"
          style={{ color: smColors.green, marginRight: 15 }}
        />
        <Link
          onClick={onCancel}
          text="CANCEL"
          style={{ color: smColors.orange }}
        />
      </ButtonsWrapper>
      {shouldShowPasswordModal && (
        <EnterPasswordModal
          submitAction={createContact}
          closeModal={() => setShouldShowPasswordModal(false)}
        />
      )}
    </Wrapper>
  );
};

export default CreateNewContact;
