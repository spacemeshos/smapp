import React from 'react';
import styled from 'styled-components';
import { captureReactBreadcrumb } from '../../sentry';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { isMnemonicExisting } from '../../../shared/mnemonic';
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
  color: ${({ theme: { color } }) => color.primary};
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

const Icon = styled.img.attrs(({ theme: { icons: { posSmesher } } }) => ({
  src: posSmesher,
}))`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const IconWallet = styled.img.attrs(
  ({
    theme: {
      icons: { walletSecond },
    },
  }) => ({
    src: walletSecond,
  })
)`
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

const WalletConnectionType = ({ history, location }: AuthRouterParams) => {
  const navigateToExplanation = () => {
    window.open(ExternalLinks.SetupGuide);
    captureReactBreadcrumb({
      category: 'Wallet connection type',
      data: {
        action: 'Navigate to explanation setup',
      },
      level: 'info',
    });
  };

  const isRecoveryMode = isMnemonicExisting(location?.state?.mnemonic);

  const navigateToBackButton = () => {
    history.push(AuthPath.Leaving);
    captureReactBreadcrumb({
      category: 'Wallet connection type',
      data: {
        action: 'Navigate to back button',
      },
      level: 'info',
    });
  };

  const navigateToRestoreExistingWallet = () => {
    history.push(AuthPath.Recover);
    captureReactBreadcrumb({
      category: 'Wallet connection type',
      data: {
        action: 'Navigate to restore existing wallet',
      },
      level: 'info',
    });
  };

  const handleNextStep = (walletOnly: boolean) => () => {
    if (location?.state?.mnemonic) {
      history.push(AuthPath.SwitchNetwork, {
        isWalletOnly: walletOnly,
        mnemonic: location.state.mnemonic,
        creatingWallet: true,
      });
      captureReactBreadcrumb({
        category: 'Wallet connection type',
        data: {
          action: 'Click next wallet step',
        },
        level: 'info',
      });
    } else {
      history.push(AuthPath.WalletType, { isWalletOnly: walletOnly });
      captureReactBreadcrumb({
        category: 'Wallet connection type',
        data: {
          action: 'Click next wallet only step',
        },
        level: 'info',
      });
    }
  };

  return (
    <Wrapper>
      <Steps step={Step.NEW_WALLET_SETUP} />
      <CorneredContainer
        width={650}
        height={400}
        header="NEW WALLET"
        subHeader="Configure your new wallet"
      >
        <BackButton action={navigateToBackButton} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon />
              <RowTitle>WALLET + NODE</RowTitle>
              <Tooltip width={120} text="To send, receive and smesh coins" />
            </Row>
            <RowText>A wallet that uses a local full Spacemesh</RowText>
            <RowText>p2p node and optionally setup smeshing</RowText>
          </RowColumn>
          <Button
            text="WALLET + NODE"
            width={150}
            isPrimary={false}
            onClick={handleNextStep(false)}
          />
        </RowJust>
        <RowSecond>
          <RowColumn>
            <Row>
              <IconWallet />
              <RowTitle>WALLET ONLY</RowTitle>
              <Tooltip width={120} text="To send and receive SMH" />
            </Row>
            <RowText>Setup a wallet that uses a public</RowText>
            <RowText>Spacemesh web service</RowText>
          </RowColumn>
          <div title="Temporarily unavailable">
            <Button
              text="WALLET ONLY"
              width={150}
              onClick={handleNextStep(true)}
              isDisabled
            />
          </div>
        </RowSecond>
        <BottomPart>
          <Link
            onClick={navigateToExplanation}
            text="NOT SURE WHAT TO DO? READ THE GUIDE "
          />
          <Row>
            {!isRecoveryMode && (
              <Link
                onClick={navigateToRestoreExistingWallet}
                text="RESTORE EXISTING WALLET"
              />
            )}
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

export default WalletConnectionType;
