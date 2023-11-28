import { ipcRenderer } from 'electron';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { curry } from 'ramda';
import { unlockWallet } from '../../redux/wallet/actions';
import { CorneredContainer } from '../../components/common';
import { LoggedOutBanner } from '../../components/banners';
import {
  Link,
  Button,
  Input,
  ErrorPopup,
  Loader,
  DropDown,
} from '../../basicComponents';
import { ipcConsts, smColors } from '../../vars';
import { smallInnerSideBar } from '../../assets/images';
import { AppThDispatch, RootState } from '../../types';
import { isWalletOnly, listWalletFiles } from '../../redux/wallet/selectors';
import {
  setLastSelectedWalletPath,
  getIndexOfLastSelectedWalletPath,
} from '../../infra/lastSelectedWalletPath';
import { AuthPath, MainPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { convertISOToDate } from '../../../shared/datetime';
import { eventsService } from '../../infra/eventsService';
import { AuthRouterParams } from './routerParams';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const Indicator = styled.div<{ hasError?: boolean }>`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({ hasError, theme }) => {
    if (hasError) return smColors.orange;
    return theme.color.primary;
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
  margin-top: 0.5em;
  margin-bottom: 1em;
`;

const Chevron = styled.img.attrs(
  ({
    theme: {
      icons: { chevronPrimaryRight },
    },
  }) => ({ src: chevronPrimaryRight })
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

const BottomPart = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding-top: 25px;
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

const RevealInFolderIcon = styled.img.attrs(
  ({
    theme: {
      icons: { posDirectoryContrast },
    },
  }) => ({
    src: posDirectoryContrast,
  })
)`
  width: 17px;
  height: 17px;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;

const handleRevealInFolder = curry((path, e) => {
  e.preventDefault();
  eventsService.showFileInFolder({ filePath: path });
});

const UnlockWallet = ({ history, location }: AuthRouterParams) => {
  const [password, setPassword] = useState('');
  const [isWrongPassword, setWrongPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(!!location?.state?.withLoader);
  const walletFiles = useSelector(listWalletFiles);
  const networksList = useSelector((state: RootState) => state.networks);

  const isWalletOnlyMode = useSelector(isWalletOnly);
  const dispatch: AppThDispatch = useDispatch();

  const [selectedWalletIndex, updateSelectedWalletIndex] = useState(
    getIndexOfLastSelectedWalletPath(walletFiles)
  );
  const networksMapName = useMemo(
    () =>
      networksList.reduce((acc, network) => {
        acc[network.genesisID] = network.netName;
        return acc;
      }, {}),
    [networksList]
  );

  useEffect(() => {
    const goNext = () => {
      setShowLoader(false);
      history.push(
        (location.state?.redirect !== AuthPath.Unlock &&
          location.state?.redirect) ||
          MainPath.Wallet
      );
    };
    ipcRenderer.on(ipcConsts.WALLET_ACTIVATED, goNext);
    return () => {
      ipcRenderer.off(ipcConsts.WALLET_ACTIVATED, goNext);
    };
  }, [history, location]);

  const dropDownData = useMemo(() => {
    if (walletFiles.length === 0) {
      return [{ label: 'NO WALLET FILES FOUND', isDisabled: true }];
    }

    return walletFiles.map(({ meta, path }) => {
      const networkName = networksMapName[meta.genesisID] ?? 'NOT SELECTED';
      return {
        label: meta.displayName,
        description: `CREATED: ${convertISOToDate(
          meta.created
        )} | NETWORK: ${networkName}`,
        endAdornment: (
          <RevealInFolderIcon onClick={handleRevealInFolder(path)} />
        ),
      };
    });
  }, [walletFiles, networksMapName]);

  const selectItem = ({ index }) => {
    setLastSelectedWalletPath(walletFiles[index].path);
    updateSelectedWalletIndex(index);
  };

  const handlePasswordTyping = ({ value }: { value: string }) => {
    setPassword(value);
    setWrongPassword(false);
  };

  const decryptWallet = async () => {
    const passwordMinimumLength = 1; // TODO: For testing purposes, set to 1 minimum length. Should be changed back to 8 when ready.
    if (!!password && password.trim().length >= passwordMinimumLength) {
      setShowLoader(true);
      if (walletFiles.length === 0) {
        throw new Error('No wallets found to unlock');
      }
      const status = await dispatch(
        unlockWallet(walletFiles[selectedWalletIndex].path, password)
      );

      if (!status.success) {
        setShowLoader(false);
        setWrongPassword(true);
      }
    }
  };
  const navigateToSetupGuide = () => window.open(ExternalLinks.SetupGuide);
  const showWalletFileSelection = walletFiles.length > 1;
  return showLoader ? (
    <Loader
      size={Loader.sizes.BIG}
      note={
        isWalletOnlyMode
          ? 'Please wait, connecting to Spacemesh api...'
          : 'Please wait, starting up Spacemesh node...'
      }
    />
  ) : (
    <Wrapper>
      {location?.state?.isLoggedOut && <LoggedOutBanner key="banner" />}
      <CorneredContainer
        width={520}
        height={showWalletFileSelection ? 415 : 310}
        header="UNLOCK"
        subHeader="Welcome back to Spacemesh."
        key="main"
      >
        {showWalletFileSelection ? (
          <>
            <Text>Select a wallet:</Text>
            <InputSection>
              <Chevron />
              <DropDown
                maxHeight={220}
                data={dropDownData}
                onClick={selectItem}
                selectedItemIndex={selectedWalletIndex}
                rowHeight={60}
                hideSelectedItem
              />
            </InputSection>
          </>
        ) : null}
        <Text>Enter wallet password:</Text>
        <Indicator hasError={isWrongPassword} />
        <SmallSideBar src={smallInnerSideBar} />
        <InputSection>
          <Chevron />
          <Input
            type="password"
            placeholder="ENTER PASSWORD"
            value={password}
            onEnterPress={decryptWallet}
            onChange={handlePasswordTyping}
            style={{ flex: 1 }}
            autofocus
          />
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
            <Link
              onClick={() => history.push(AuthPath.Recover)}
              text="OPEN AN EXISTING WALLET"
              style={{ marginRight: 'auto' }}
            />
            <Link
              onClick={() => history.push(AuthPath.ConnectionType)}
              text="CREATE"
              style={{ marginRight: 'auto' }}
            />
            <Link
              onClick={navigateToSetupGuide}
              text="SETUP GUIDE"
              style={{ marginRight: 'auto' }}
            />
          </LinksWrapper>
          <Button
            text="UNLOCK"
            isDisabled={!password.trim() || Boolean(isWrongPassword)}
            onClick={decryptWallet}
            style={{ marginTop: 'auto' }}
          />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default UnlockWallet;
