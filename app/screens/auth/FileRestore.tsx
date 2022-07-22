import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { restoreFile } from '../../redux/wallet/actions';
import { BackButton } from '../../components/common';
import { DragAndDrop } from '../../components/auth';
import { WrapperWith2SideBars, Button, Link } from '../../basicComponents';
import { AppThDispatch, RootState } from '../../types';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { setLastSelectedWalletPath } from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';

const DdArea = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 20px;
  background-color: ${smColors.restoreGreen};
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
    } else {
      setFileName(fileName);
      setFilePath(filePath);
      setHasError(false);
    }
  };

  const openWalletFile = async () => {
    const success = await dispatch(restoreFile({ filePath }));
    if (success) {
      setLastSelectedWalletPath(filePath);
      history.push(AuthPath.Unlock);
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
