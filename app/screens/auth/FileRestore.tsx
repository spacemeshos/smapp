import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { restoreFile } from '../../redux/wallet/actions';
import { BackButton } from '../../components/common';
import { DragAndDrop } from '../../components/auth';
import { WrapperWith2SideBars, Button, Link, SmallHorizontalPanel } from '../../basicComponents';
import { RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { smColors } from '../../vars';

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

const FileRestore = ({ history }: RouteComponentProps) => {
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [hasError, setHasError] = useState(false);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  const addFile = ({ fileName, filePath }: { fileName: string; filePath: string }) => {
    if (fileName.split('.').pop() !== 'json') {
      setHasError(true);
    } else {
      setFileName(fileName);
      setFilePath(filePath);
      setHasError(false);
    }
  };

  const openWalletFile = async () => {
    dispatch(restoreFile({ filePath }));
    history.push('/auth/unlock');
  };

  const navigateToBackupGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/backup?id=restoring-from-a-backup-file' });

  return (
    <WrapperWith2SideBars width={800} height={480} isDarkMode={isDarkMode} header="RESTORE WALLET FROM FILE" subHeader="Locate wallet restore file.">
      <SmallHorizontalPanel isDarkMode={isDarkMode} />
      <BackButton action={history.goBack} />
      <DdArea>
        <DragAndDrop onFilesAdded={addFile} fileName={fileName} hasError={hasError} isDarkMode={isDarkMode} />
      </DdArea>
      <BottomSection>
        <Link onClick={navigateToBackupGuide} text="BACKUP GUIDE" />
        <Button onClick={openWalletFile} text="RESTORE" isDisabled={hasError || !fileName} />
      </BottomSection>
    </WrapperWith2SideBars>
  );
};

export default FileRestore;
