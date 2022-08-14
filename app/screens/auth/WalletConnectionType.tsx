import React from 'react';
import styled from 'styled-components';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
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
  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  const handleNextStep = (walletOnly: boolean) => () => {
    if (location?.state?.mnemonic) {
      history.push(AuthPath.SwitchNetwork, {
        isWalletOnly: walletOnly,
        mnemonic: location.state.mnemonic,
        creatingWallet: true,
      });
    } else {
      history.push(AuthPath.WalletType, { isWalletOnly: walletOnly });
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
        <BackButton action={() => history.push(AuthPath.Leaving)} />
        <RowJust>
          <RowColumn>
            <Row>
              <Icon />
              <RowTitle>WALLET + NODE</RowTitle>
              <Tooltip width={100} text="WALLET + NODE" />
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
              <Tooltip width={100} text="Wallet only" />
            </Row>
            <RowText>Setup a wallet that uses a public</RowText>
            <RowText>Spacemesh web service</RowText>
          </RowColumn>
          <Button
            text="WALLET ONLY"
            width={150}
            onClick={handleNextStep(true)}
          />
        </RowSecond>
        <BottomPart>
          <Link
            onClick={navigateToExplanation}
            text="NOT SURE WHAT TO DO? READ THE GUIDE "
          />
          <Row>
            <Link
              onClick={() => history.push(AuthPath.Recover)}
              text="RESTORE EXISTING WALLET"
            />
            <Tooltip width={100} text="RESTORE EXISTING WALLET" />
          </Row>
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default WalletConnectionType;
