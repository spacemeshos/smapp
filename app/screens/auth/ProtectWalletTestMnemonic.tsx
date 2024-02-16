import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { BackButton } from '../../components/common';
import TestMe from '../backup/TestMe';
import { AuthPath } from '../../routerPaths';
import { CreateWalletResponse } from '../../../shared/ipcMessages';
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

const ProtectWalletTestMnemonic = () => {
  const location = useLocation<{
    mnemonic: string;
    createWallet: CreateWalletResponse;
  }>();
  const history = useHistory();

  return (
    <Wrapper>
      <Steps step={Step.PROTECT_WALLET} />
      <ContentSection>
        <BackButton action={history.goBack} />
        <TestMe
          mnemonic={location.state.mnemonic}
          nextButtonHandler={() =>
            history.push(AuthPath.WalletCreated, {
              ...location.state.createWallet,
            })
          }
        />
      </ContentSection>
    </Wrapper>
  );
};

export default ProtectWalletTestMnemonic;
