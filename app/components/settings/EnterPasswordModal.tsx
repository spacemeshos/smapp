import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { captureReactBreadcrumb } from '../../sentry';
import { unlockCurrentWallet } from '../../redux/wallet/actions';
import { Modal } from '../common';
import { Button, Input, ErrorPopup } from '../../basicComponents';

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 0.5em;
  margin-bottom: 1em;
`;

const Chevron = styled.img.attrs(
  ({
    theme: {
      icons: { chevronPrimaryRight },
    },
  }) => ({
    src: chevronPrimaryRight,
  })
)`
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

const EnterPasswordModal = ({
  submitAction,
  closeModal,
  walletName,
}: Props) => {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const dispatch = useDispatch();
  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setHasError(false);
    captureReactBreadcrumb({
      category: 'Enter Password Modal',
      data: {
        action: 'Password typing',
      },
      level: 'info',
    });
  };

  const reset = () => {
    setPassword('');
    setHasError(false);
    captureReactBreadcrumb({
      category: 'Enter Password Modal',
      data: {
        action: 'Reset error password',
      },
      level: 'info',
    });
  };

  const submitActionWrapper = async () => {
    // @ts-ignore
    const { success } = await dispatch(unlockCurrentWallet(password));
    if (success) {
      submitAction({ password });
      captureReactBreadcrumb({
        category: 'Enter Password Modal',
        data: {
          action: 'Active action wrapper',
        },
        level: 'info',
      });
    } else {
      setHasError(true);
      captureReactBreadcrumb({
        category: 'Enter Password Modal',
        data: {
          action: 'Active action wrapper error',
        },
        level: 'info',
      });
    }
  };

  const handleCancelModal = () => {
    closeModal();
    captureReactBreadcrumb({
      category: 'Enter Password Modal',
      data: {
        action: 'Click cancel button',
      },
      level: 'info',
    });
  };

  return (
    <Modal
      header="PASSWORD"
      subHeader={`Enter wallet ${
        walletName || ''
      } password to complete this action.`}
    >
      <InputSection>
        <Chevron />
        <Input
          type="password"
          placeholder="ENTER PASSWORD"
          value={password}
          onEnterPress={submitActionWrapper}
          onChange={handlePasswordTyping}
          style={{ flex: 1 }}
          autofocus
        />
        <ErrorSection>
          {hasError && (
            <ErrorPopup
              onClick={reset}
              text="Sorry, this password doesn't ring a bell, please try again"
            />
          )}
        </ErrorSection>
      </InputSection>
      <ButtonsWrapper>
        <Button
          text="UNLOCK"
          isDisabled={!password.trim() || hasError}
          onClick={submitActionWrapper}
        />
        <Button text="CANCEL" isPrimary={false} onClick={handleCancelModal} />
      </ButtonsWrapper>
    </Modal>
  );
};

export default EnterPasswordModal;
