import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
import { posSmesherWhite, walletSecondWhite, walletSecondBlack, posSmesherBlack } from '../../assets/images';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

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

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const WalletConnectionType = ({ history }: AuthRouterParams) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  const handleNextStep = (walletOnly: boolean) => () => {
    history.push(AuthPath.WalletType, { isWalletOnly: walletOnly });
  };

  return (
    <Wrapper>
      <Steps step={Step.NEW_WALLET_SETUP} isDarkMode={isDarkMode} />
      <CorneredContainer width={650} height={400} header="NEW WALLET" subHeader="Configure your new wallet" isDarkMode={isDarkMode}>
        <BackButton action={() => history.push(AuthPath.Leaving)} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon src={`${isDarkMode ? posSmesherWhite : posSmesherBlack}`} />
              <RowTitle>WALLET + NODE</RowTitle>
              <Tooltip width={100} text="WALLET + NODE" isDarkMode={isDarkMode} />
            </Row>
            <RowText>A wallet that uses a local full Spacemesh</RowText>
            <RowText>p2p node and optionally setup smeshing</RowText>
          </RowColumn>
          <Button text="WALLET + NODE" width={150} isPrimary={false} onClick={handleNextStep(false)} />
        </RowJust>
        <RowSecond>
          <RowColumn>
            <Row>
              <IconWallet src={`${isDarkMode ? walletSecondWhite : walletSecondBlack}`} />
              <RowTitle>WALLET ONLY</RowTitle>
              <Tooltip width={100} text="Wallet only" isDarkMode={isDarkMode} />
            </Row>
            <RowText>Setup a wallet that uses a public</RowText>
            <RowText>Spacemesh web service</RowText>
          </RowColumn>
          <Button text="WALLET ONLY" width={150} onClick={handleNextStep(true)} />
        </RowSecond>
        <BottomPart>
          <Link onClick={navigateToExplanation} text="NOT SURE WHAT TO DO? READ THE GUIDE " />
          <Row>
            <Link onClick={() => history.push(AuthPath.Recover)} text="RESTORE EXISTING WALLET" />
            <Tooltip width={100} text="RESTORE EXISTING WALLET" isDarkMode={isDarkMode} />
          </Row>
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default WalletConnectionType;
