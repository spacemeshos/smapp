import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createNewWallet } from '../../redux/wallet/actions';
import { CorneredContainer, PasswordInput } from '../../components/common';
import { Input, Button, Link, Loader, ErrorPopup } from '../../basicComponents';
import {
  getCurrentWalletFile,
  isWalletOnly,
} from '../../redux/wallet/selectors';
import { WalletType } from '../../../shared/types';
import { AuthPath } from '../../routerPaths';
import { setLastSelectedWalletPath } from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';
import { validationWalletName } from './Validation';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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

const Chevron = styled.img.attrs(({ theme: { icons: { chevronRight } } }) => ({
  src: chevronRight,
}))`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const ChevronPassword = styled(Chevron)`
  margin-bottom: 28px;
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

const SetNameInputTitle = styled.div`
  margin-bottom: auto;
  padding-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${({
    theme: {
      header: { color },
    },
  }) => color};
`;

const CreateWallet = ({ history, location }: AuthRouterParams) => {
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [verifyPasswordError, setVerifyPasswordError] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const isWalletOnlyMode = useSelector(isWalletOnly);
  const currentWalletPath = useSelector(getCurrentWalletFile);
  const dispatch = useDispatch();
  const [convenientWalletName, setConvenientWalletName] = useState('');
  const [nameWalletError, setNameWalletError] = useState('');

  useEffect(() => {
    // Store create wallet to localStorage to choose it
    // in the dropdown next time
    if (!currentWalletPath) return;
    setLastSelectedWalletPath(currentWalletPath);
  }, [currentWalletPath]);

  const handleValidateWalletName = () => {
    const nameWalletError = validationWalletName(convenientWalletName);
    if (nameWalletError) {
      setNameWalletError(nameWalletError);
    }
    return !nameWalletError;
  };

  const validate = () => {
    const hasVerifyPasswordError =
      !verifiedPassword || password !== verifiedPassword;
    const verifyPasswordError = hasVerifyPasswordError
      ? "These passwords don't match"
      : '';
    setVerifyPasswordError(verifyPasswordError);
    return !verifyPasswordError;
  };

  const createWallet = async () => {
    if (!isLoaderVisible) {
      setIsLoaderVisible(true);
      await dispatch(
        createNewWallet({
          existingMnemonic: location?.state?.mnemonic,
          password,
          type: location?.state?.isWalletOnly
            ? WalletType.RemoteApi
            : WalletType.LocalNode,
          genesisID: location?.state?.genesisID || '',
          apiUrl: location?.state?.apiUrl || null,
          name: convenientWalletName,
          mnemonicType: location?.state?.mnemonicType || 12,
        })
      );
      setIsLoaderVisible(false);
    }
  };

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
  };

  const handlePasswordVerifyTyping = ({ value }: { value: string }) => {
    setVerifiedPassword(value);
    setVerifyPasswordError('');
  };

  const handleNameTyping = ({ value }: { value: string }) => {
    setConvenientWalletName(value);
  };

  const nextAction = () => {
    if (validate() && handleValidateWalletName()) {
      createWallet();

      // recovery wallet mode
      if (location?.state?.mnemonic) {
        history.push(AuthPath.WalletCreated);
        return;
      }

      history.push(AuthPath.ProtectWallet);
    }
  };

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  if (isLoaderVisible) {
    return (
      <LoaderWrapper>
        <Loader
          size={Loader.sizes.BIG}
          note={
            isWalletOnlyMode
              ? 'Please wait, connecting to Spacemesh api...'
              : 'Please wait, starting up Spacemesh node...'
          }
        />
      </LoaderWrapper>
    );
  }
  return (
    <Wrapper>
      <Steps step={Step.CREATE_WALLET} />

      <CorneredContainer
        width={650}
        height={500}
        header={'CREATE YOUR WALLET'}
        subHeader={
          'With this step, your Wallet will be created. Set up a password you will be using to access it later. Remember, there will be no way to recover the lost password.'
        }
      >
        {
          <>
            <UpperPart>
              <Inputs>
                <InputSection>
                  <ChevronPassword />
                  <PasswordInput
                    password={password}
                    onChange={handlePasswordTyping}
                    onEnterPress={nextAction}
                    passwordIndicator
                  />
                </InputSection>
                <InputSection>
                  <Chevron />
                  <Input
                    value={verifiedPassword}
                    type="password"
                    placeholder="VERIFY PASSWORD"
                    onEnterPress={nextAction}
                    onChange={handlePasswordVerifyTyping}
                  />
                </InputSection>
              </Inputs>
              <ErrorSection>
                {Boolean(verifyPasswordError) && (
                  <ErrorPopup
                    onClick={() => setVerifyPasswordError('')}
                    text={verifyPasswordError}
                  />
                )}
              </ErrorSection>
            </UpperPart>
            --
            <SetNameInputTitle>
              Set a convenient name for your wallet (optional):
            </SetNameInputTitle>
            <Inputs style={{ width: '49%' }}>
              <InputSection>
                <Chevron />
                <Input
                  value={convenientWalletName}
                  type="text"
                  placeholder="CONVENIENT NAME"
                  onChange={handleNameTyping}
                />
              </InputSection>
            </Inputs>
            <ErrorSection>
              {nameWalletError && (
                <ErrorPopup
                  onClick={() => setNameWalletError('')}
                  text={nameWalletError}
                />
              )}
            </ErrorSection>
          </>
        }
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET GUIDE" />
          <Button onClick={nextAction} text="NEXT" />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default CreateWallet;
