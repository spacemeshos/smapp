import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CorneredContainer, BackButton } from '../../components/common';
import { StepsContainer, Button, Link, Loader, SmallHorizontalPanel, Tooltip } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { walletSecondWhite } from '../../assets/images';

import { smColors } from '../../vars';
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

const PurpleText = styled.span`
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;
  color: ${smColors.purple};
`;
const GreenText = styled.span`
  font-size: 16px;
  line-height: 20px;
  font-weight: bold;
  color: ${smColors.green};
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
  margin-top: 10px;
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
  margin-top: 60px;
  position: relative;
  align-items: flex-end;
  &:after {
    content: '';
    position: absolute;
    background-color: ${({ theme }) => (theme.isDarkMode ? smColors.darkerGray : smColors.black)};
    width: 100%;
    top: -29px;
    left: 0px;
    height: 1px;
  }
`;
const RowColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const Icon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 3px;
`;
const IconWallet = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 3px;
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

interface Props {
  history: {
    push(url: string, ob?: any): void;
    goBack: () => void;
  };
}

const SetupWallet = ({ history }: Props) => {
  const [subMode] = useState(1);
  const [isLoaderVisible] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  if (isLoaderVisible) {
    return (
      <LoaderWrapper>
        <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
      </LoaderWrapper>
    );
  }
  const header = 'WALLET SETUP';

  return (
    <Wrapper>
      <StepsContainer steps={['SETUP WALLET + MINER', 'PROTECT WALLET', 'SELECT DRIVE', 'ALLOCATE SPACE']} header={''} currentStep={1} isDarkMode={isDarkMode} />
      <CorneredContainer width={650} height={400} header={header} subHeader="Select which features you`d like to setup" isDarkMode={isDarkMode}>
        <SmallHorizontalPanel isDarkMode={isDarkMode} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon src={walletSecondWhite} />
              <RowTitle>STANDARD WALLET</RowTitle>
              <Tooltip width={100} text="STANDARD WALLET" isDarkMode={isDarkMode} />
            </Row>
            <PurpleText>(STANDARD SECURITY)</PurpleText>
          </RowColumn>
          <Button text="STANDARD WALLET" width={150} isPrimary={false} onClick={() => history.push('/auth/create', { withoutNode: false })} />
        </RowJust>
        <RowSecond>
          <RowColumn>
            <Row>
              <IconWallet src={walletSecondWhite} />
              <RowTitle>HARDWARE WALLET</RowTitle>
              <Tooltip width={100} text="HARDWARE WALLET" isDarkMode={isDarkMode} />
            </Row>
            <RowText>Using a Ledger device</RowText>
            <GreenText>(ENHANCED SECURITY)</GreenText>
          </RowColumn>
          <Button text="HARDWARE WALLET" onClick={() => {}} width={150} isDisabled />
        </RowSecond>

        {subMode === 1 && (
          <>
            <BackButton action={history.goBack} />
          </>
        )}
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          {subMode === 1 && (
            <Row>
              <Link onClick={() => history.push('/auth/restore')} text="RESTORE  WALLET" /> <Tooltip width={100} text="RESTORE EXISTING WALLET" isDarkMode={isDarkMode} />
            </Row>
          )}
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default SetupWallet;
