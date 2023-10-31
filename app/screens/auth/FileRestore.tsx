import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { captureReactBreadcrumb } from '../../sentry';
import { restoreFile } from '../../redux/wallet/actions';
import { BackButton } from '../../components/common';
import { DragAndDrop } from '../../components/auth';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { AppThDispatch } from '../../types';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { setLastSelectedWalletPath } from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';

const DdArea = styled.div`
  display: flex;
  flex: 1;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: ${smColors.disabledGray10Alpha};
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const FileRestore = ({ history }: AuthRouterParams) => {
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [hasError, setHasError] = useState(false);

  const dispatch: AppThDispatch = useDispatch();

  const addFile = ({
    fileName,
    filePath,
  }: {
    fileName: string;
    filePath: string;
  }) => {
    if (fileName.split('.').pop() !== 'json') {
      setHasError(true);
      captureReactBreadcrumb({
        category: 'File Restore',
        data: {
          action: 'Add restore wallet file with error',
        },
        level: 'info',
      });
    } else {
      setFileName(fileName);
      setFilePath(filePath);
      setHasError(false);
    }
    captureReactBreadcrumb({
      category: 'File Restore',
      data: {
        action: 'Add restore wallet file',
      },
      level: 'info',
    });
  };

  const openWalletFile = async () => {
    const success = await dispatch(restoreFile({ filePath }));
    if (success) {
      setLastSelectedWalletPath(filePath);
      history.push(AuthPath.Unlock);
    }
    captureReactBreadcrumb({
      category: 'File Restore',
      data: {
        action: 'Open wallet file for restore',
      },
      level: 'info',
    });
  };

  const navigateToBackButton = () => {
    history.push(AuthPath.Recover);
    captureReactBreadcrumb({
      category: 'File Restore',
      data: {
        action: 'Navigate to back button',
      },
      level: 'info',
    });
  };

  const navigateToBackupGuide = () => {
    window.open(ExternalLinks.RestoreFileGuide);
    captureReactBreadcrumb({
      category: 'File Restore',
      data: {
        action: 'Navigate to backup guide',
      },
      level: 'info',
    });
  };

  return (
    <WrapperWith2SideBars
      width={800}
      height={480}
      header="OPEN WALLET"
      subHeader="Open a wallet from a wallet file"
    >
      <BackButton action={navigateToBackButton} />
      <DdArea>
        <DragAndDrop
          onFilesAdded={addFile}
          fileName={fileName}
          hasError={hasError}
        />
      </DdArea>
      <BottomSection>
        <Link onClick={navigateToBackupGuide} text="BACKUP GUIDE" />
        <Button
          onClick={openWalletFile}
          text="OPEN"
          isDisabled={hasError || !fileName}
        />
      </BottomSection>
    </WrapperWith2SideBars>
  );
};

export default FileRestore;
