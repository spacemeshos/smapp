import React from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';
import { AuthPath } from '../../routerPaths';
import WordsBackup from '../backup/WordsBackup';
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
  const location = useLocation();

  const handleNext = (mnemonic: string) => {
    history.push(AuthPath.ProtectWalletTestMnemonic, {
      createWallet: location.state,
      mnemonic,
    });
  };

  const handleSkip = () => {
    history.push(AuthPath.WalletCreated, location.state);
  };

  return (
    <Wrapper>
      <Steps step={Step.PROTECT_WALLET} />
      <ContentSection>
        <WordsBackup
          mnemonics={location?.state?.wallet?.crypto?.mnemonic}
          nextButtonHandler={handleNext}
          skipButtonHandler={handleSkip}
        />
      </ContentSection>
    </Wrapper>
  );
};

export default ProtectWallet;
