import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../basicComponents';
import Modal from '../../components/common/Modal';
import { eventsService } from '../../infra/eventsService';
import { RootState } from '../../types';
import { smColors } from '../../vars';
import { setUiFilePermissionError } from '../../redux/ui/actions';
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
  line-height: 16px;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex: 1;
  overflow-y: auto;
  height: 150px;
`;

const RedText = styled.span`
  color: ${smColors.red};
`;

const WriteFilePermissionError = () => {
  const dispatch = useDispatch();
  const filePermissionError = useSelector(
    (state: RootState) => state.ui.filePermissionError
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);

  useEffect(() => {
    setShowModal(Boolean(filePermissionError));
  }, [filePermissionError]);

  if (!showModal) {
    return null;
  }
  const openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  const handleIgnore = () => {
    dispatch(setUiFilePermissionError(null));
    setShowModal(false);
  };

  return (
    <ReactPortal modalId="spacemesh-folder-permission">
      <Modal
        header="Error :)"
        subHeader="Check permission on writing..."
        width={600}
        height={450}
      >
        <ErrorMessage>
          {filePermissionError}
          {'\n'}
          It is very <RedText>important</RedText> to keep the state of the node
          and in case of critical issue help to you.
        </ErrorMessage>
        <ButtonsWrapper>
          <Button isPrimary={false} onClick={handleIgnore} text="BACK" />
          <Button onClick={openLogFile} text="GIVE ACCESS" />
        </ButtonsWrapper>
      </Modal>
    </ReactPortal>
  );
};

export default WriteFilePermissionError;
