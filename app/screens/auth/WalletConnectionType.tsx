import React from 'react';
import styled from 'styled-components';
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

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const WalletConnectionType = ({ history, location }: AuthRouterParams) => {
  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);
  const isRecoveryMode = isMnemonicExisting(location?.state?.mnemonic);
  const handleNextStep = () => () => {
    if (location?.state?.mnemonic) {
      history.push(AuthPath.SwitchNetwork, {
        mnemonic: location.state.mnemonic,
        creatingWallet: true,
      });
    } else {
      history.push(AuthPath.WalletType);
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
        <BottomPart>
          <Link
            onClick={navigateToExplanation}
            text="NOT SURE WHAT TO DO? READ THE GUIDE "
          />
          <Row>
            {!isRecoveryMode && (
              <Link
                onClick={() => history.push(AuthPath.Recover)}
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
