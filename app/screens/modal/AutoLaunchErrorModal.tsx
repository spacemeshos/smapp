import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../basicComponents';
import Modal from '../../components/common/Modal';
import { getWarningByType } from '../../redux/ui/selectors';
import { WarningType } from '../../../shared/warning';
import { omitWarning } from '../../redux/ui/actions';
import ReactPortal from './ReactPortal';

const StyledErrorMessage = styled.pre`
  font-size: 14px;
  line-height: 1.33em;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex: 1;
  overflow-y: auto;
  height: 150px;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const AutoLaunchErrorModal: React.FC = () => {
  const dispatch = useDispatch();
  const autoLaunchError = useSelector(
    getWarningByType(WarningType.SyncAutoStartAndConfig)
  );

  if (!autoLaunchError?.message) {
    return null;
  }

  const handleDismiss = () => {
    dispatch(omitWarning(autoLaunchError));
  };

  return (
    <ReactPortal>
      <Modal
        header="Auto Launch Error"
        subHeader="Error in setting up auto launch"
        width={600}
        height={450}
      >
        <StyledErrorMessage>{autoLaunchError.message}</StyledErrorMessage>
        <StyledContainer>
          <Button onClick={handleDismiss} text="DISMISS" />
        </StyledContainer>
      </Modal>
    </ReactPortal>
  );
};

export default AutoLaunchErrorModal;
