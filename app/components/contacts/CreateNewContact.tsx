import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addToContacts } from '../../redux/wallet/actions';
import { EnterPasswordModal } from '../settings';
import { Input, Link, ErrorPopup } from '../../basicComponents';
import { smColors } from '../../vars';
import { Contact, RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';

const Wrapper = styled.div<{ isStandalone: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${({ isStandalone }) => (isStandalone ? '215px' : '100%')};
  height: ${({ isStandalone }) => (isStandalone ? '100%' : '140px')};
  ${({ isStandalone }) => isStandalone && `background-color: ${smColors.purple}; padding: 15px;`}
`;

const Header = styled.div<{ isStandalone: boolean }>`
  font-family: SourceCodeProBold;
  font-size: 15px;
  line-height: 20px;
  color: ${({ isStandalone, theme }) => {
    if (isStandalone) {
      return smColors.white;
    } else {
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
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
  isStandalone?: boolean;
  initialAddress?: string;
  onCompleteAction: () => void;
  onCancel: () => void;
};

const CreateNewContact = ({ isStandalone = false, initialAddress = '', onCompleteAction, onCancel }: Props) => {
  const [address, setAddress] = useState(initialAddress || '');
  // const [initialAddress, setIn] = useState(initialAddress || '');
  const [nickname, setNickname] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shouldShowPasswordModal, setShouldShowPasswordModal] = useState(false);

  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  const currentAccountIndex = useSelector((state: RootState) => state.wallet.currentAccountIndex);
  const dispatch = useDispatch();

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

  const validate = () => {
    const nicknameRegex = /^([a-zA-Z0-9_-])$/;
    if (nicknameRegex.test(nickname)) {
      return 'Nickname is missing or invalid';
    }
    const addressRegex = /\b0[xX][a-zA-Z0-9]{40}\b/;
    if (!addressRegex.test(address)) {
      return 'Address is invalid';
    }
    let retVal = '';
    contacts.forEach((contact: Contact) => {
      if (contact.nickname === nickname) {
        retVal = 'Nickname should be unique';
      }
    });
    return retVal;
  };

  const preCreateContact = () => {
    const errorMsg = validate();
    if (errorMsg) {
      setHasError(true);
      setErrorMsg(errorMsg);
    } else {
      setShouldShowPasswordModal(true);
    }
  };

  const createContact = async ({ password }: { password: string }) => {
    await dispatch(addToContacts({ password, contact: { address, nickname } }));
    await eventsService.updateTransaction({ newData: { address, nickname }, accountIndex: currentAccountIndex, txId: '' });
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
              setHasError(false);
            }}
            maxLength="50"
            style={isStandalone ? inputStyle2 : inputStyle1}
            autofocus
          />
          <Input
            value={address}
            placeholder="Account address 0x24f7..."
            onChange={({ value }) => {
              setAddress(value);
              setHasError(false);
            }}
            maxLength="64"
            style={isStandalone ? inputStyle3 : inputStyle1}
            onFocus={handleFocus}
          />
          {hasError && <ErrorPopup onClick={() => setHasError(false)} text={errorMsg} style={{ bottom: 60, left: 'calc(50% - 90px)' }} />}
        </InputWrapperUpperPart>
        <InputWrapperLowerPart />
      </InputsWrapper>
      <ButtonsWrapper>
        <Link onClick={preCreateContact} text="CREATE" style={{ color: smColors.green, marginRight: 15 }} />
        <Link onClick={onCancel} text="CANCEL" style={{ color: smColors.orange }} />
      </ButtonsWrapper>
      {shouldShowPasswordModal && <EnterPasswordModal submitAction={createContact} closeModal={() => setShouldShowPasswordModal(false)} />}
    </Wrapper>
  );
};

export default CreateNewContact;
