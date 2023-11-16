import React from 'react';
import styled from 'styled-components';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
import { walletSecondWhite } from '../../assets/images';

import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const PurpleText = styled.span`
  font-size: 16px;
  line-height: 20px;
  font-weight: 800;
  color: ${smColors.purple};
`;

const RowTitle = styled.h3`
  font-size: 16px;
  line-height: 24px;
  font-weight: 800;
  color: ${({ theme: { color } }) => color.primary};
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

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const WalletType = ({ history, location }: AuthRouterParams) => {
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
      <Steps step={Step.NEW_WALLET_TYPE} />
      <CorneredContainer
        width={650}
        height={400}
        header="WALLET SETUP"
        subHeader="Smapp currently supports only Standard Wallets. For Hardware Wallet, please use SMCLI."
      >
        <BackButton action={history.goBack} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon src={walletSecondWhite} />
              <RowTitle>STANDARD WALLET</RowTitle>
              <Tooltip width={140} text="Stored locally on your computer" />
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
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          <Row>
            <Link
              onClick={() => history.push(AuthPath.Recover)}
              text="RESTORE  WALLET"
            />{' '}
            <Tooltip
              width={120}
              text="Locate a file or restore from 12/24 words"
            />
          </Row>
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default WalletType;
