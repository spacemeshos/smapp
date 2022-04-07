import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { smColors } from '../../vars';
import { RootState } from '../../types';

const Text = styled.span`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
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

const FileBackup = ({ history, location }: RouteComponentProps<Record<string, any>, StaticContext, { filePath: string }>) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const showBackupFile = () => {
    eventsService.showFileInFolder({ filePath: location.state.filePath });
  };

  const backToWalletRoot = () => {
    history.push('/main/wallet');
  };

  const openBackupGuide = () => window.open('https://testnet.spacemesh.io/#/backup');

  return (
    <WrapperWith2SideBars width={820} header="BACKUP EXISTING WALLET" subHeader="A wallet restore file has been saved." isDarkMode={isDarkMode}>
      <Text>A restore file has been created in your documents folder.</Text>
      <Link onClick={showBackupFile} text="Browse file location" />
      <Text>You can use this file to restore your spacemesh wallet on any computer.</Text>
      <BottomRow>
        <Link onClick={openBackupGuide} text="BACKUP GUIDE" />
        <Button onClick={backToWalletRoot} text="GOT IT" width={95} />
      </BottomRow>
    </WrapperWith2SideBars>
  );
};

export default FileBackup;
