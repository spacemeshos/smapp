import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { captureReactBreadcrumb } from '../../sentry';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { MainPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const Text = styled.span`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.color.contrast};
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

const FileBackup = ({
  history,
  location,
}: RouteComponentProps<
  Record<string, any>,
  StaticContext,
  { filePath: string }
>) => {
  const showBackupFile = () => {
    eventsService.showFileInFolder({ filePath: location.state.filePath });
    captureReactBreadcrumb({
      category: 'File Backup',
      data: {
        action: 'Show backup file',
      },
      level: 'info',
    });
  };

  const backToWalletRoot = () => {
    history.push(MainPath.Wallet);
    captureReactBreadcrumb({
      category: 'File Backup',
      data: {
        action: 'Back to wallet root',
      },
      level: 'info',
    });
  };

  const openBackupGuide = () => {
    window.open(ExternalLinks.BackupGuide);
    captureReactBreadcrumb({
      category: 'File Backup',
      data: {
        action: 'Open backup guide',
      },
      level: 'info',
    });
  };

  return (
    <WrapperWith2SideBars
      width={820}
      header="BACKUP EXISTING WALLET"
      subHeader="A wallet restore file has been saved."
    >
      <Text>A restore file has been created in your documents folder.</Text>
      <Link onClick={showBackupFile} text="Browse file location" />
      <Text>
        You can use this file to restore your spacemesh wallet on any computer.
      </Text>
      <BottomRow>
        <Link onClick={openBackupGuide} text="BACKUP GUIDE" />
        <Button onClick={backToWalletRoot} text="GOT IT" width={95} />
      </BottomRow>
    </WrapperWith2SideBars>
  );
};

export default FileBackup;
