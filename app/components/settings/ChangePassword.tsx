import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { eventsService } from '../../infra/eventsService';
import { ErrorPopup, Input, Link, Loader, Button } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import EnterPasswordModal from './EnterPasswordModal';

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

const ChangePassword = () => {
  let timeOut: any = null;
  const displayName = useSelector(
    (state: RootState) => state.wallet.meta.displayName
  );
  const [isOldPasswordRequested, setOldPasswordRequested] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(timeOut);
    };
  });

  const currentWalletPath = useSelector(
    (state: RootState) => state.wallet.currentWalletPath
  );
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setPasswordError('');
  };

  const handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    setVerifiedPassword(value);
    setVerifyPasswordError('');
  };

  const startUpdatingPassword = () => setIsEditMode(true);

  const clearFields = () => {
    setPassword('');
    setVerifiedPassword('');
    setIsEditMode(false);
    setPasswordError('');
    setVerifyPasswordError('');
    setIsLoaderVisible(false);
    setOldPasswordRequested(false);
  };

  const validate = () => {
    const pasMinLength = 1; // TODO: Changed to 8 before testnet.
    const hasPasswordError =
      !password || (!!password && password.length < pasMinLength);
    const hasVerifyPasswordError =
      !verifiedPassword || password !== verifiedPassword;
    const passwordError = hasPasswordError
      ? `Password has to be ${pasMinLength} characters or more.`
      : '';
    const verifyPasswordError = hasVerifyPasswordError
      ? "these passwords don't match, please try again "
      : '';
    setPasswordError(password);
    setVerifyPasswordError(verifiedPassword);
    return !passwordError && !verifyPasswordError;
  };

  const updatePassword = async (prevPassword: string) => {
    if (validate() && !isLoaderVisible && currentWalletPath) {
      setIsLoaderVisible(false);
      eventsService.changePassword({
        path: currentWalletPath,
        prevPassword,
        nextPassword: password,
      });
      timeOut = setTimeout(() => clearFields(), 500);
    }
  };

  if (isLoaderVisible) {
    return <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />;
  }
  return (
    <Wrapper>
      <LeftPart>
        {isEditMode ? (
          [
            <Input
              value={password}
              type="password"
              placeholder="Type new password"
              onChange={handlePasswordTyping}
              style={{ marginBottom: 15 }}
              key="pass"
              autofocus
            />,
            <Input
              value={verifiedPassword}
              type="password"
              placeholder="Verify password"
              onChange={handlePasswordVerifyTyping}
              key="passRetype"
            />,
          ]
        ) : (
          <Input value="***********" type="password" isDisabled />
        )}
        {isOldPasswordRequested && (
          <EnterPasswordModal
            walletName={displayName}
            submitAction={({ password }) => updatePassword(password)}
            closeModal={clearFields}
          />
        )}
        {(!!passwordError || !!verifyPasswordError) && (
          <ErrorPopup
            onClick={() => {
              setPasswordError('');
              setVerifyPasswordError('');
            }}
            text={passwordError || verifyPasswordError}
            style={{ top: '95px', right: '-30px' }}
          />
        )}
      </LeftPart>
      <RightPart>
        {isEditMode ? (
          [
            <Link
              onClick={() => setOldPasswordRequested(true)}
              text="SAVE"
              style={{ marginRight: 15 }}
              key="change"
            />,
            <Link
              onClick={clearFields}
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
