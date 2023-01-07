import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { eventsService } from '../../infra/eventsService';
import { ErrorPopup, Input, Link, Loader, Button } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import EnterPasswordModal from './EnterPasswordModal';

type ValidateError = {
  type: 'passwordError' | 'verifiedPasswordError';
  description: string;
} | null;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const LeftPart = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const RightPart = styled.div`
  display: flex;
  flex-direction: row;
  flex: 2;
  justify-content: flex-end;
  align-items: center;
`;

const FieldsColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldRow = styled.div`
  display: flex;
  position: relative;
`;

const ChangePassword = () => {
  const displayName = useSelector(
    (state: RootState) => state.wallet.meta.displayName
  );
  const [isOldPasswordRequested, setOldPasswordRequested] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const [newPasswordError, setNewPasswordError] = useState<ValidateError>();

  const currentWalletPath = useSelector(
    (state: RootState) => state.wallet.currentWalletPath
  );

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setNewPassword(value);
  };

  const handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    setVerifiedPassword(value);
  };

  const startUpdatingPassword = () => setIsEditMode(true);

  const clear = () => {
    setNewPassword('');
    setVerifiedPassword('');
    setNewPasswordError(null);
  };

  const cancel = () => {
    clear();
    setIsEditMode(false);
    setNewPasswordError(null);
    setOldPasswordRequested(false);
    setIsLoaderVisible(false);
  };

  const updatePassword = (prevPassword: string) => {
    if (!isLoaderVisible && currentWalletPath) {
      setIsLoaderVisible(true);

      eventsService.changePassword({
        path: currentWalletPath,
        prevPassword,
        nextPassword: newPassword,
      });

      setTimeout(cancel, 500);
    }
  };

  if (isLoaderVisible) {
    return <Loader size={Loader.sizes.BIG} />;
  }

  const validatePassword = (): ValidateError => {
    const pasMinLength = 1;
    if (!newPassword || (!!newPassword && newPassword.length < pasMinLength)) {
      return {
        type: 'passwordError',
        description: `Password has to be ${pasMinLength} characters or more.`,
      };
    }

    if (!verifiedPassword || newPassword !== verifiedPassword) {
      return {
        type: 'verifiedPasswordError',
        description: "These passwords don't match, please try again.",
      };
    }

    return null;
  };

  const savePassword = () => {
    const validateResult = validatePassword();
    if (!validateResult) {
      setOldPasswordRequested(true);
    }
    setNewPasswordError(validateResult);
  };

  return (
    <Wrapper>
      <LeftPart>
        {isEditMode ? (
          <FieldsColumn>
            <FieldRow>
              <Input
                value={newPassword}
                type="password"
                placeholder="Type new password"
                onChange={handlePasswordTyping}
                style={{ marginBottom: 15 }}
                key="pass"
                autofocus
              />
              {newPasswordError?.type === 'passwordError' && (
                <ErrorPopup
                  onClick={() => {
                    clear();
                    setNewPasswordError(null);
                  }}
                  text={newPasswordError.description}
                  style={{
                    top: 3,
                    left: 'calc(100% + 4px)',
                    width: 150,
                  }}
                />
              )}
            </FieldRow>
            <FieldRow>
              <Input
                value={verifiedPassword}
                type="password"
                placeholder="Verify password"
                onChange={handlePasswordVerifyTyping}
                key="passRetype"
              />
              {newPasswordError?.type === 'verifiedPasswordError' && (
                <ErrorPopup
                  onClick={() => {
                    clear();
                    setNewPasswordError(null);
                  }}
                  text={newPasswordError.description}
                  style={{
                    top: 3,
                    left: 'calc(100% + 4px)',
                    width: 150,
                  }}
                />
              )}
            </FieldRow>
          </FieldsColumn>
        ) : (
          <Input value="***********" type="password" isDisabled />
        )}
        {isOldPasswordRequested && (
          <EnterPasswordModal
            walletName={displayName}
            submitAction={({ password }) => updatePassword(password)}
            closeModal={cancel}
          />
        )}
      </LeftPart>
      <RightPart>
        {isEditMode ? (
          [
            <Link
              onClick={() => savePassword()}
              text="SAVE"
              style={{ marginRight: 15 }}
              key="change"
            />,
            <Link
              onClick={cancel}
              text="CANCEL"
              style={{ color: smColors.darkGray }}
              key="cancel"
            />,
          ]
        ) : (
          <Button onClick={startUpdatingPassword} text="CHANGE" width={180} />
        )}
      </RightPart>
    </Wrapper>
  );
};

export default ChangePassword;
