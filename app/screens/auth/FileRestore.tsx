import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { restoreFile } from '../../redux/wallet/actions';
import { BackButton } from '../../components/common';
import { DragAndDrop } from '../../components/auth';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { AppThDispatch } from '../../types';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { setLastSelectedWalletPath } from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { FilesAddedHandler } from '../../components/auth/DragAndDrop';
import { AddWalletResponseType } from '../../../shared/ipcMessages';
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
  const dragAndDropRef = useRef<{ resetFileInput: () => void }>(null);

  const dispatch: AppThDispatch = useDispatch();
  const addFile: FilesAddedHandler = ({ fileName, filePath }) => {
    setFileName(fileName);
    setFilePath(filePath);
    const hasError = fileName.split('.').pop() !== 'json';
    setHasError(hasError);
  };

  const openWalletFile = async () => {
    const status = await dispatch(restoreFile({ filePath }));
    if (AddWalletResponseType.WalletAdded === status) {
      setLastSelectedWalletPath(filePath);
      history.push(AuthPath.Unlock);
    } else if (AddWalletResponseType.DuplicateNotAllowed === status) {
      dragAndDropRef.current?.resetFileInput();
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const navigateToBackupGuide = () =>
    window.open(ExternalLinks.RestoreFileGuide);

  return (
    <WrapperWith2SideBars
      width={800}
      height={480}
      header="OPEN WALLET"
      subHeader="Open a wallet from a wallet file"
    >
      <BackButton action={history.goBack} />
      <DdArea>
        <DragAndDrop
          ref={dragAndDropRef}
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
