import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CorneredContainer } from '../../components/common';
import { Button, Link } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { getCurrentWalletFile } from '../../redux/wallet/selectors';
import { MainPath, WalletPath } from '../../routerPaths';
import { setLastSelectedWalletPath } from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { isLocalNodeApi } from '../../../shared/utils';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const SubHeader = styled.div`
  color: ${({ theme }) => theme.color.contrast};
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const WalletCreated = ({ history, location }: AuthRouterParams) => {
  const currentWalletPath = useSelector(getCurrentWalletFile);

  useEffect(() => {
    // Store create wallet to localStorage to choose it
    // in the dropdown next time
    if (!currentWalletPath) return;
    setLastSelectedWalletPath(currentWalletPath);
  }, [currentWalletPath]);

  const nextAction = () => {
    if (
      location?.state?.genesisID &&
      typeof location?.state?.apiUrl === 'string' &&
      isLocalNodeApi(location.state.apiUrl)
    ) {
      history.push(MainPath.SmeshingSetup);
      return;
    }
    history.push(WalletPath.Overview);
  };

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  return (
    <Wrapper>
      <Steps step={Step.WALLET_CREATED} />
      <CorneredContainer width={650} height={400} header={'WALLET CREATED'}>
        <SubHeader>
          Your wallet was created and saved in a password-protected file
          <br />
          <br />
          <Link
            onClick={() => eventsService.showFileInFolder({})}
            text="Browse file location"
          />
        </SubHeader>
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET GUIDE" />
          <Button onClick={nextAction} text="Go to Wallet!" width={125} />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default WalletCreated;
