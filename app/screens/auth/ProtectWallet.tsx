import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { AuthPath } from '../../routerPaths';
import TwelveWordsBackup from '../backup/TwelveWordsBackup';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 10px;
  margin-top: 2px;
  position: relative;
`;

const ProtectWallet = () => {
  const history = useHistory();
  const handleNext = (mnemonic: string) => {
    history.push(AuthPath.ProtectWalletTestMnemonic, { mnemonic });
  };
  const handleSkip = () => {
    history.push(AuthPath.WalletCreated);
  };
  return (
    <Wrapper>
      <Steps step={Step.PROTECT_WALLET} />
      <ContentSection>
        <TwelveWordsBackup
          nextButtonHandler={handleNext}
          skipButtonHandler={handleSkip}
        />
      </ContentSection>
    </Wrapper>
  );
};

export default ProtectWallet;
