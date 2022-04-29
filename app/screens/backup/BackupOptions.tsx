import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { backupWallet } from '../../redux/wallet/actions';
import {
  WrapperWith2SideBars,
  Button,
  Link,
  CorneredWrapper,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { AppThDispatch, RootState } from '../../types';
import { BackupPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SmallText = styled.span`
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 6px;
  flex: 1;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const GreenText = styled(SmallText)`
  color: ${smColors.green};
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  margin-bottom: 50px;
`;

const RightSection = styled(CorneredWrapper)`
  position: relative;
  display: flex;
  flex-direction: row;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 100%;
  padding: 25px 15px 15px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
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

const BackupOptions = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch: AppThDispatch = useDispatch();

  const navigateTo12WordsBackup = () => {
    history.push(BackupPath.Mnemonics);
  };

  const handleBackupWallet = async () => {
    const filePath = await dispatch(backupWallet());
    if (filePath) {
      history.push(BackupPath.File, { filePath });
    }
  };

  const openBackupGuide = () => window.open(ExternalLinks.BackupGuide);

  return (
    <Wrapper>
      <WrapperWith2SideBars
        width={300}
        header="WALLET"
        style={{ marginRight: 10 }}
        isDarkMode={isDarkMode}
      >
        <BoldText>How would you like to backup your wallet?</BoldText>
        <Text>
          Your wallet is encrypted using your password. We recommend you backup
          your wallet for additional security.
        </Text>
      </WrapperWith2SideBars>
      <RightSection isDarkMode={isDarkMode}>
        <MiddleSection>
          <MiddleSectionRow>
            <SmallText style={{ marginRight: 22 }}>Basic Security</SmallText>
            <SmallText>
              Advanced Security <GreenText>(Recommended)</GreenText>
            </SmallText>
          </MiddleSectionRow>
          <MiddleSectionRow>
            <Button
              onClick={handleBackupWallet}
              text="FILE BACKUP"
              isPrimary={false}
              isContainerFullWidth
              style={{ marginRight: 22 }}
            />
            <Button
              onClick={navigateTo12WordsBackup}
              text="12 WORDS BACKUP"
              isPrimary={false}
              isContainerFullWidth
            />
          </MiddleSectionRow>
          <BottomRow>
            <Link onClick={openBackupGuide} text="BACKUP GUIDE" />
          </BottomRow>
        </MiddleSection>
      </RightSection>
    </Wrapper>
  );
};

export default BackupOptions;
