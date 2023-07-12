import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { restoreFile } from '../../redux/wallet/actions';
import { BackButton } from '../../components/common';
import { DragAndDrop } from '../../components/auth';
import {
  WrapperWith2SideBars,
  Button,
  Link,
  ErrorPopup,
} from '../../basicComponents';
import { AppThDispatch, RootState } from '../../types';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import {
  setLastSelectedWalletPath,
  getLastSelectedWalletPath,
} from '../../infra/lastSelectedWalletPath';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';

const errorPopupStyle = { top: 3, right: 111 };

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
  position: relative;
`;

const FileRestore = ({ history }: AuthRouterParams) => {
  const [fileName, setFileName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [hasError, setHasError] = useState(false);
  const wallet = useSelector((state: RootState) => state.wallet);
  const [sameWalletAdded, setSameWalletAdded] = useState<boolean>(false);

  const dispatch: AppThDispatch = useDispatch();

  const addFile = ({
    fileName,
    filePath,
  }: {
    fileName: string;
    filePath: string;
  }) => {
    const matchResult = fileName.match(
      /\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}.\d{3}Z/
    );
    const walletTimeCreated = matchResult ? matchResult[0] : null;

    const lastPath = getLastSelectedWalletPath();

    if (fileName.split('.').pop() !== 'json') {
      setHasError(true);
    } else {
      if (walletTimeCreated === wallet.meta.created || filePath === lastPath) {
        setSameWalletAdded(true);
      }
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
        {sameWalletAdded && (
          <ErrorPopup
            onClick={() => {}}
            text="The same wallet is selected as was opened earlier."
            style={errorPopupStyle}
          />
        )}
        <Button
          onClick={openWalletFile}
          text="OPEN"
          isDisabled={hasError || !fileName || sameWalletAdded}
        />
      </BottomSection>
    </WrapperWith2SideBars>
  );
};

export default FileRestore;
