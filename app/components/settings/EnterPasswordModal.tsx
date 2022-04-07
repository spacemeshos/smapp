import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { unlockCurrentWallet } from '../../redux/wallet/actions';
import { Modal } from '../common';
import { Button, Input, ErrorPopup } from '../../basicComponents';
import { chevronRightBlack, chevronRightWhite } from '../../assets/images';
import { RootState } from '../../types';

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0 15px 0;
`;

type Props = {
  submitAction: ({ password }: { password: string }) => void;
  closeModal: () => void;
  walletName?: string;
};

const EnterPasswordModal = ({ submitAction, closeModal, walletName }: Props) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  const chevronIcon = isDarkMode ? chevronRightWhite : chevronRightBlack;

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setHasError(false);
  };

  const reset = () => {
    setPassword('');
    setHasError(false);
  };

  const submitActionWrapper = async () => {
    try {
      setIsActive(false);
      await dispatch(unlockCurrentWallet(password));
      submitAction({ password });
    } catch {
      setHasError(true);
      setIsActive(true);
    }
  };

  return (
    <Modal header="PASSWORD" subHeader={`Enter wallet ${walletName || ''} password to complete this action.`}>
      <InputSection>
        <Chevron src={chevronIcon} />
        <Input type="password" placeholder="ENTER PASSWORD" value={password} onEnterPress={submitActionWrapper} onChange={handlePasswordTyping} autofocus />
        <ErrorSection>{hasError && <ErrorPopup onClick={reset} text="sorry, this password doesn't ring a bell, please try again" />}</ErrorSection>
      </InputSection>
      <ButtonsWrapper>
        <Button text="UNLOCK" isDisabled={!password.trim() || !!hasError || !isActive} onClick={submitActionWrapper} />
        <Button text="CANCEL" isPrimary={false} onClick={closeModal} />
      </ButtonsWrapper>
    </Modal>
  );
};

export default EnterPasswordModal;
