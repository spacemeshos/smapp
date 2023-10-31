import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { captureReactBreadcrumb } from '../../sentry';
import { eventsService } from '../../infra/eventsService';
import { ErrorPopup, Input, Link, Loader, Button } from '../../basicComponents';
import { smColors } from '../../vars';
import { AppThDispatch, RootState } from '../../types';
import { PasswordInput } from '../common';
import { unlockCurrentWallet } from '../../redux/wallet/actions';

type ValidateError = {
  type: 'passwordError' | 'verifiedPasswordError' | 'currentPasswordError';
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
const FieldRowCurPass = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 15px;
`;

const ChangePassword = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState<ValidateError>();
  const currentWalletPath = useSelector(
    (state: RootState) => state.wallet.currentWalletPath
  );
  const dispatch: AppThDispatch = useDispatch();
  const handlePasswordTyping = ({ value }: { value: string }) => {
    setNewPassword(value);
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Type new password',
      },
      level: 'info',
    });
  };

  const handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    setVerifiedPassword(value);
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Type verify password',
      },
      level: 'info',
    });
  };

  const handleCurrentPassword = ({ value }: { value: string }) => {
    setCurrentPassword(value);
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Type current password',
      },
      level: 'info',
    });
  };

  const startUpdatingPassword = () => {
    setIsEditMode(true);
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Start updating password',
      },
      level: 'info',
    });
  };

  const isCurrentPasswordValid = async () => {
    const { success } = await dispatch(unlockCurrentWallet(currentPassword));
    return success;
  };

  const cancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setVerifiedPassword('');
    setIsEditMode(false);
    setNewPasswordError(null);
    setIsLoaderVisible(false);
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Close modal updating password',
      },
      level: 'info',
    });
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
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Check process updating password',
      },
      level: 'info',
    });
  };

  if (isLoaderVisible) {
    return <Loader size={Loader.sizes.BIG} />;
  }

  const validatePassword = (): ValidateError => {
    if (!currentPassword || newPassword === currentPassword) {
      return {
        type: 'passwordError',
        description:
          'The new password must not to be the same as the current password',
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

  const savePassword = async () => {
    const isCurrentPasswordValidStatus = await isCurrentPasswordValid();
    captureReactBreadcrumb({
      category: 'Change password',
      data: {
        action: 'Click button save password',
      },
      level: 'info',
    });

    if (!isCurrentPasswordValidStatus) {
      setNewPasswordError({
        type: 'currentPasswordError',
        description: 'Please enter your current password correctly!',
      });
      return;
    }

    const validateStatus = validatePassword();
    if (!validateStatus) {
      updatePassword(currentPassword);
    }

    setNewPasswordError(validateStatus);
  };

  return (
    <Wrapper>
      <LeftPart>
        {isEditMode ? (
          <FieldsColumn>
            <FieldRowCurPass>
              <Input
                key="currentPass"
                value={currentPassword}
                onChange={handleCurrentPassword}
                placeholder="Current password"
                type="password"
                autofocus
              />
              {newPasswordError?.type === 'currentPasswordError' && (
                <ErrorPopup
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPasswordError(null);
                  }}
                  text={newPasswordError.description}
                  style={{
                    top: 3,
                    left: 'calc(100% + 4px)',
                    width: 250,
                  }}
                />
              )}
            </FieldRowCurPass>
            <FieldRow>
              <PasswordInput
                key="pass"
                password={newPassword}
                placeholder="Type new password"
                onChange={handlePasswordTyping}
                passwordIndicator
              />
              {newPasswordError?.type === 'passwordError' && (
                <ErrorPopup
                  onClick={() => {
                    setNewPassword('');
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
                    setVerifiedPassword('');
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
