import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { unlockWallet } from '../../redux/wallet/actions';
import { CorneredContainer } from '../../components/common';
import { LoggedOutBanner } from '../../components/banners';
import { Link, Button, Input, ErrorPopup, Loader } from '../../basicComponents';
import { smColors } from '../../vars';
import { smallInnerSideBar, chevronRightBlack, chevronRightWhite } from '../../assets/images';
import { AppThDispatch, RootState } from '../../types';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { AuthRouterParams } from './routerParams';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.div`
  margin: -15px 0 15px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const Indicator = styled.div<{ hasError?: boolean }>`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({ hasError, theme }) => {
    if (hasError) return smColors.orange;
    return theme.isDarkMode ? smColors.white : smColors.black;
  }};
`;

const SmallSideBar = styled.img`
  position: absolute;
  bottom: 0;
  right: -30px;
  width: 15px;
  height: 50px;
`;

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

const BottomPart = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding-top: 45px;
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const GrayText = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.disabledGray};
`;

const UnlockWallet = ({ history, location }: AuthRouterParams) => {
  const [password, setPassword] = useState('');
  const [isWrongPassword, setWrongPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const isWalletOnlyMode = useSelector(isWalletOnly);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch: AppThDispatch = useDispatch();
  const chevronIcon = isDarkMode ? chevronRightWhite : chevronRightBlack;

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setWrongPassword(false);
  };

  const decryptWallet = async () => {
    const passwordMinimumLength = 1; // TODO: For testing purposes, set to 1 minimum length. Should be changed back to 8 when ready.
    if (!!password && password.trim().length >= passwordMinimumLength) {
      setShowLoader(true);
      const status = await dispatch(unlockWallet({ password }));
      setShowLoader(false);
      if (status.success) {
        const nextPage = (location.state?.redirect !== '/auth/unlock' && location.state?.redirect) || '/main/wallet';
        if (status.forceNetworkSelection) {
          history.push('/auth/switch-network', { redirect: nextPage, isWalletOnly: status.isWalletOnly });
          return;
        }
        history.push(nextPage);
      } else {
        setWrongPassword(true);
      }
    }
  };
  const navigateToSetupGuide = () => window.open('https://testnet.spacemesh.io/#/guide/setup');
  return showLoader ? (
    <Loader
      size={Loader.sizes.BIG}
      isDarkMode={isDarkMode}
      note={isWalletOnlyMode ? 'Please wait, connecting to Spacemesh api...' : 'Please wait, starting up Spacemesh node...'}
    />
  ) : (
    <Wrapper>
      {location?.state?.isLoggedOut && <LoggedOutBanner key="banner" />}
      <CorneredContainer width={520} height={310} header="UNLOCK" subHeader="Welcome back to Spacemesh." key="main" isDarkMode={isDarkMode}>
        <Text>Please enter your wallet password.</Text>
        <Indicator hasError={isWrongPassword} />
        <SmallSideBar src={smallInnerSideBar} />
        <InputSection>
          <Chevron src={chevronIcon} />
          <Input type="password" placeholder="ENTER PASSWORD" value={password} onEnterPress={decryptWallet} onChange={handlePasswordTyping} style={{ flex: 1 }} autofocus />
          <ErrorSection>
            {isWrongPassword && (
              <ErrorPopup
                onClick={() => {
                  setPassword('');
                  setWrongPassword(false);
                }}
                text="Sorry, this password doesn't ring a bell, please try again."
              />
            )}
          </ErrorSection>
        </InputSection>
        <BottomPart>
          <LinksWrapper>
            <GrayText>FORGOT YOUR PASSWORD?</GrayText>
            <Link onClick={() => history.push('/auth/restore')} text="RESTORE" style={{ marginRight: 'auto' }} />
            <Link onClick={() => history.push('/auth/create')} text="CREATE" style={{ marginRight: 'auto' }} />
            <Link onClick={navigateToSetupGuide} text="SETUP GUIDE" style={{ marginRight: 'auto' }} />
          </LinksWrapper>
          <Button text="UNLOCK" isDisabled={!password.trim() || !!isWrongPassword} onClick={decryptWallet} style={{ marginTop: 'auto' }} />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default UnlockWallet;
