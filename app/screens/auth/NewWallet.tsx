import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { CorneredContainer, BackButton } from '../../components/common';
import { StepsContainer, Button, Link, Loader, SmallHorizontalPanel, Tooltip } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { posSmesherWhite, walletSecondWhite } from '../../assets/images';

import { smColors, nodeConsts } from '../../vars';
import { RootState } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const RowText = styled.span`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const RowTitle = styled.h3`
  font-size: 16px;
  line-height: 24px;
  font-weight: bold;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const RowJust = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const RowSecond = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 50px;
`;
const RowColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const Icon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;
const IconWallet = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
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

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { mnemonic?: string; withoutNode?: boolean };
  };
}

const NewWallet = ({ history, location }: Props) => {
  const [subMode] = useState(1);
  const [isLoaderVisible] = useState(false);

  const miningStatus = useSelector((state: RootState) => state.node.miningStatus);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  if (isLoaderVisible) {
    return (
      <LoaderWrapper>
        <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
      </LoaderWrapper>
    );
  }
  const header = 'NEW WALLET';
  const isWalletOnlySetup = !!location?.state?.withoutNode || miningStatus !== nodeConsts.NOT_MINING;

  return (
    <Wrapper>
      <StepsContainer steps={isWalletOnlySetup ? ['NEW WALLET SETUP'] : ['NEW WALLET SETUP', 'NEW WALLET TYPE']} header={''} currentStep={0} isDarkMode={isDarkMode} />
      <CorneredContainer width={650} height={400} header={header} subHeader="Configure your new wallet" isDarkMode={isDarkMode}>
        <SmallHorizontalPanel isDarkMode={isDarkMode} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon src={posSmesherWhite} />
              <RowTitle>WALLET + NODE</RowTitle>
              <Tooltip width={100} text="WALLET + NODE" isDarkMode={isDarkMode} />
            </Row>
            <RowText>A wallet that uess a local full Spacemesh</RowText>
            <RowText>p2p node and optionally setup smeshing</RowText>
          </RowColumn>
          <Button text="WALLET + NODE" width={150} isPrimary={false} onClick={() => history.push('/auth/setup-wallet', { withoutNode: false })} />
        </RowJust>
        <RowSecond>
          <RowColumn>
            <Row>
              <IconWallet src={walletSecondWhite} />
              <RowTitle>WALLET ONLY</RowTitle>
              <Tooltip width={100} text="Wallet only" isDarkMode={isDarkMode} />
            </Row>
            <RowText>Setup a wallet that uses a publick</RowText>
            <RowText>Spacemesh web service</RowText>
          </RowColumn>
          <Button text="WALLET ONLY" width={150} onClick={() => history.push('/auth/connect-wallet')} />
        </RowSecond>

        {subMode === 1 && (
          <>
            <BackButton action={() => history.push('/auth/leaving')} />
          </>
        )}
        <BottomPart>
          <Link onClick={navigateToExplanation} text="NOT SURE WHAT TO DO? READ THE GUIDE " />
          {subMode === 1 && (
            <Row>
              <Link onClick={() => history.push('/auth/restore')} text="RESTORE EXISTING WALLET" /> <Tooltip width={100} text="RESTORE EXISTING WALLET" isDarkMode={isDarkMode} />
            </Row>
          )}
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default NewWallet;
