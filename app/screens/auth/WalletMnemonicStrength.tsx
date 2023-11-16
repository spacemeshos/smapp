import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { BackButton } from '../../components/common';
import { MnemonicStrengthType } from '../../../shared/types';
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

const ButtonWrapper = styled.div`
  width: 100%;
`;

const WalletMnemonicStrength = () => {
  const history = useHistory();
  const location = useLocation<AuthLocationState>();

  const openBackupGuide = () => window.open(ExternalLinks.BackupGuide);
  const handleNext = (mnemonicStrengthType: MnemonicStrengthType) =>
    history.push(AuthPath.CreateWallet, {
      genesisID: location.state.genesisID,
      mnemonic: {
        strength: mnemonicStrengthType,
      },
    });

  return (
    <Wrapper>
      <Steps step={Step.SELECT_WALLET_MNEMONIC_STRENGTH} />
      <ContentSection>
        <WrapperWith2SideBars
          width={720}
          height={400}
          header="CHOOSE THE MNEMONIC SECURITY LEVEL"
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
              <ButtonWrapper>
                <Button
                  onClick={() => handleNext(12)}
                  text="12 WORDS MNEMONIC"
                  isPrimary={false}
                  style={{ marginRight: 22 }}
                  width={250}
                />
              </ButtonWrapper>
              <ButtonWrapper>
                <Button
                  onClick={() => handleNext(24)}
                  text="24 WORDS MNEMONIC"
                  isPrimary={false}
                  width={250}
                />
              </ButtonWrapper>
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
