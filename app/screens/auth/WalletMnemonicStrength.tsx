import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { BackButton } from '../../components/common';
import { MnemonicStrengthType } from '../../../shared/ipcMessages';
import Steps, { Step } from './Steps';
import { AuthLocationState } from './routerParams';

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

const SmallText = styled.span`
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 6px;
  flex: 1;
  color: ${({ theme }) => theme.color.contrast};
`;

const GreenText = styled(SmallText)`
  color: ${smColors.green};
`;

const RightSection = styled.div`
  margin-top: 25px;
`;

const MiddleSectionRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const BottomRow = styled(MiddleSectionRow)`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
`;

const WalletMnemonicStrength = () => {
  const history = useHistory();
  const location = useLocation<AuthLocationState>();

  const openBackupGuide = () => window.open(ExternalLinks.BackupGuide);
  const handleNext = (mnemonicType: MnemonicStrengthType) =>
    history.push(AuthPath.CreateWallet, {
      genesisID: location.state.genesisID,
      isWalletOnly: location.state.isWalletOnly,
      mnemonic: location.state.mnemonic,
      mnemonicType,
    });

  return (
    <Wrapper>
      <Steps step={Step.SELECT_WALLET_MNEMONIC_STRENGTH} />
      <ContentSection>
        <WrapperWith2SideBars
          width={920}
          header="YOUR WORDS BACKUP"
          subHeader={'text'}
        >
          <BackButton action={history.goBack} />
          <RightSection>
            <MiddleSectionRow>
              <SmallText style={{ marginRight: 22 }}>Basic Security</SmallText>
              <SmallText>
                Advanced Security <GreenText>(Recommended)</GreenText>
              </SmallText>
            </MiddleSectionRow>
            <MiddleSectionRow>
              <Button
                onClick={() => handleNext(12)}
                text="12 WORDS MNEMONIC"
                isPrimary={false}
                isContainerFullWidth
                style={{ marginRight: 22 }}
                width={250}
              />
              <Button
                onClick={() => handleNext(24)}
                text="24 WORDS MNEMONIC"
                isPrimary={false}
                isContainerFullWidth
                width={250}
              />
            </MiddleSectionRow>
          </RightSection>
          <BottomRow>
            <Link onClick={openBackupGuide} text="BACKUP GUIDE" />
          </BottomRow>
        </WrapperWith2SideBars>
      </ContentSection>
    </Wrapper>
  );
};

export default WalletMnemonicStrength;
