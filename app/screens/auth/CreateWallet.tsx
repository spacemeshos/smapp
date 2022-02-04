import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { isLocalNodeApi } from '../../../shared/utils';
import { createNewWallet } from '../../redux/wallet/actions';
import { CorneredContainer } from '../../components/common';
import { Input, Button, Link, Loader, ErrorPopup } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { chevronRightBlack, chevronRightWhite } from '../../assets/images';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { WalletType } from '../../../shared/types';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const SubHeader = styled.div`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
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

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const CreateWallet = ({ history, location }: AuthRouterParams) => {
  const [subMode, setSubMode] = useState(1);
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const isWalletOnlyMode = useSelector(isWalletOnly);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  const renderSubHeader = (subMode: number) => {
    return subMode === 1 ? (
      <SubHeader>Protect your wallet with a password. You will need it to access latter</SubHeader>
    ) : (
      <SubHeader>
        Your wallet was created and saved in a password-protected file
        <br />
        <br />
        <Link onClick={() => eventsService.showFileInFolder({})} text="Browse file location" />
      </SubHeader>
    );
  };

  const validate = () => {
    const pasMinLength = 1; // TODO: Changed to 8 before testnet.
    const hasPasswordError = !password || (!!password && password.length < pasMinLength);
    const hasVerifyPasswordError = !verifiedPassword || password !== verifiedPassword;
    // eslint-disable-next-line no-template-curly-in-string
    const passwordError = hasPasswordError ? 'Password has to be ${pasMinLength} characters or more.' : '';
    const verifyPasswordError = hasVerifyPasswordError ? "These passwords don't match, please try again." : '';
    setPasswordError(passwordError);
    setVerifiedPassword(verifyPasswordError);
    return !passwordError && !verifyPasswordError;
  };

  const createWallet = async () => {
    if (!isLoaderVisible) {
      setIsLoaderVisible(true);
      await dispatch(
        createNewWallet({
          existingMnemonic: location?.state?.mnemonic,
          password,
          type: location?.state?.isWalletOnly ? WalletType.RemoteApi : WalletType.LocalNode,
          netId: location?.state?.netId || -1,
          apiUrl: location?.state?.apiUrl || null,
        })
      );
      setSubMode(2);
      setIsLoaderVisible(false);
    }
  };

  const handleEnterPress = () => {
    if (validate()) {
      createWallet();
    }
  };

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setPasswordError('');
  };

  const handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    setVerifiedPassword(value);
    setVerifyPasswordError('');
  };

  const nextAction = () => {
    if (subMode === 1 && validate()) {
      createWallet();
    } else if (subMode === 2) {
      if (location?.state?.netId && typeof location?.state?.apiUrl === 'string' && isLocalNodeApi(location.state.apiUrl)) {
        history.push('/main/node-setup');
        return;
      }
      history.push('/main/wallet');
    }
  };

  const navigateToExplanation = () => window.open('https://testnet.spacemesh.io/#/guide/setup');

  const chevronRight = isDarkMode ? chevronRightWhite : chevronRightBlack;
  if (isLoaderVisible) {
    return (
      <LoaderWrapper>
        <Loader
          size={Loader.sizes.BIG}
          isDarkMode={isDarkMode}
          note={isWalletOnlyMode ? 'Please wait, connecting to Spacemesh api...' : 'Please wait, starting up Spacemesh node...'}
        />
      </LoaderWrapper>
    );
  }
  const header = subMode === 1 ? 'PROTECT YOUR WALLET' : 'WALLET PASSWORD PROTECTED';
  return (
    <Wrapper>
      <Steps step={Step.PROTECT_WALLET} isDarkMode={isDarkMode} />
      <CorneredContainer width={650} height={400} header={header} subHeader={renderSubHeader(subMode)} isDarkMode={isDarkMode}>
        {subMode === 1 && (
          <>
            <UpperPart>
              <Inputs>
                <InputSection>
                  <Chevron src={chevronRight} />
                  <Input value={password} type="password" placeholder="ENTER PASSWORD" onEnterPress={handleEnterPress} onChange={handlePasswordTyping} autofocus />
                </InputSection>
                <InputSection>
                  <Chevron src={chevronRight} />
                  <Input value={verifiedPassword} type="password" placeholder="VERIFY PASSWORD" onEnterPress={handleEnterPress} onChange={handlePasswordVerifyTyping} />
                </InputSection>
              </Inputs>
              <ErrorSection>
                {(!!passwordError || !!verifyPasswordError) && (
                  <ErrorPopup
                    onClick={() => {
                      setPasswordError('');
                      setVerifyPasswordError('');
                    }}
                    text={passwordError || verifyPasswordError}
                  />
                )}
              </ErrorSection>
            </UpperPart>
          </>
        )}
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET GUIDE" />
          <Button onClick={nextAction} text="NEXT" />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default CreateWallet;
