import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
import { walletSecondWhite } from '../../assets/images';

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
  &:after {
    content: '';
    position: absolute;
    background-color: ${({ theme }) =>
      theme.isDarkMode ? smColors.darkerGray : smColors.black};
    width: 100%;
    top: -29px;
    left: 0;
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

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const WalletType = ({ history, location }: AuthRouterParams) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  const navigateToCreateWallet = async () => {
    const { isWalletOnly } = location.state;
    history.push(AuthPath.SwitchNetwork, {
      ...(isWalletOnly
        ? { isWalletOnly }
        : { redirect: AuthPath.CreateWallet }),
      creatingWallet: true,
    });
  };

  return (
    <Wrapper>
      <Steps step={Step.NEW_WALLET_TYPE} isDarkMode={isDarkMode} />
      <CorneredContainer
        width={650}
        height={400}
        header="WALLET SETUP"
        subHeader="Select which features you`d like to setup"
        isDarkMode={isDarkMode}
      >
        <BackButton action={history.goBack} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon src={walletSecondWhite} />
              <RowTitle>STANDARD WALLET</RowTitle>
              <Tooltip
                width={100}
                text="STANDARD WALLET"
                isDarkMode={isDarkMode}
              />
            </Row>
            <PurpleText>(STANDARD SECURITY)</PurpleText>
          </RowColumn>
          <Button
            text="STANDARD WALLET"
            width={150}
            isPrimary={false}
            onClick={navigateToCreateWallet}
          />
        </RowJust>
        <RowSecond>
          <RowColumn>
            <Row>
              <IconWallet src={walletSecondWhite} />
              <RowTitle>HARDWARE WALLET</RowTitle>
              <Tooltip
                width={100}
                text="HARDWARE WALLET"
                isDarkMode={isDarkMode}
              />
            </Row>
            <RowText>Using a Ledger device</RowText>
            <GreenText>(ENHANCED SECURITY)</GreenText>
          </RowColumn>
          <Button
            text="HARDWARE WALLET"
            onClick={() => {}}
            width={150}
            isDisabled
          />
        </RowSecond>
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          <Row>
            <Link
              onClick={() => history.push(AuthPath.Recover)}
              text="RESTORE  WALLET"
            />{' '}
            <Tooltip
              width={100}
              text="RESTORE EXISTING WALLET"
              isDarkMode={isDarkMode}
            />
          </Row>
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default WalletType;
