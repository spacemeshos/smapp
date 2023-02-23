import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  WarningType,
  WriteFilePermissionWarningKind,
} from '../../../shared/warning';
import { Button } from '../../basicComponents';
import Modal from '../../components/common/Modal';
import { eventsService } from '../../infra/eventsService';
import { getWarningByType } from '../../redux/ui/selectors';
import { smColors } from '../../vars';
import { omitWarning } from '../../redux/ui/actions';
import ReactPortal from './ReactPortal';

const ButtonsWrapper = styled.div<{ hasSingleButton?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) =>
    hasSingleButton ? 'center' : 'space-between'};
  margin: auto 0 15px 0;
  padding-top: 30px;
`;

const ErrorMessage = styled.pre`
  font-size: 14px;
  line-height: 1.33em;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex: 1;
  overflow-y: auto;
  height: 150px;
`;

const RedText = styled.span`
  color: ${smColors.red};
`;

const getSubheader = (kind: WriteFilePermissionWarningKind) => {
  switch (kind) {
    case WriteFilePermissionWarningKind.ConfigFile:
      return 'Not enough permissions to write a config file';
    case WriteFilePermissionWarningKind.Logger:
      return 'Not enough permissions to write a log file';
    case WriteFilePermissionWarningKind.WalletFile:
      return 'Not enough permissions to write a wallet file';
    default:
      return 'Not enough permissions to write a file...';
  }
};

const WriteFilePermissionError = () => {
  const dispatch = useDispatch();
  const filePermissionError = useSelector(
    getWarningByType(WarningType.WriteFilePermission)
  );

  if (!filePermissionError) {
    return null;
  }
  const showFile = () => {
    eventsService.showFileInFolder({
      filePath: filePermissionError.payload.filePath,
    });
  };

  const isCriticalError =
    filePermissionError.payload.kind ===
      WriteFilePermissionWarningKind.Logger ||
    filePermissionError.payload.kind ===
      WriteFilePermissionWarningKind.ConfigFile;

  const handleDismiss = () => {
    dispatch(omitWarning(filePermissionError));
  };

  const subheader = getSubheader(filePermissionError.payload.kind);

  return (
    <ReactPortal modalId="spacemesh-folder-permission">
      <Modal header="Error" subHeader={subheader} width={600} height={450}>
        <ErrorMessage>
          {filePermissionError.message}
          {'\n\n'}
          {filePermissionError.payload.kind ===
            WriteFilePermissionWarningKind.WalletFile && (
            <>
              <RedText>Do not close application:</RedText>
              <br />
              Recent changes in wallet file will be lost.
              {'\n\n'}
            </>
          )}
          <RedText>
            {isCriticalError
              ? 'Please, check file system permissions and restart Smapp.'
              : 'Please, check file system permissions and try again.'}
          </RedText>
        </ErrorMessage>
        <ButtonsWrapper>
          {!isCriticalError && (
            <Button isPrimary={false} onClick={handleDismiss} text="DISMISS" />
          )}
          <Button onClick={showFile} text="SHOW FILE" />
        </ButtonsWrapper>
      </Modal>
    </ReactPortal>
  );
};

export default WriteFilePermissionError;
