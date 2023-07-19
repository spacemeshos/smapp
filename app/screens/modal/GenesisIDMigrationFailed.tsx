import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { WarningType } from '../../../shared/warning';
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

const Code = styled.pre`
  display: inline-block;
  padding: 0.1em 0.4em;
  background: ${smColors.black20Alpha};
  border-radius: ${({ theme }) => theme.popups.boxRadius / 2}px;
  margin-top: 0.2em;

  direction: rtl;
  text-overflow: ellipsis;
  text-align: right;
  max-width: 260px;
  overflow: hidden;

  margin-bottom: -0.4em;
  margin-top: 0.4em;

  cursor: pointer;
  &:hover,
  &:focus {
    background: ${smColors.black30Alpha};
  }
`;

const RedText = styled.span`
  color: ${smColors.red};
`;

const GenesisIDMigrationFailed = () => {
  const dispatch = useDispatch();
  const warning = useSelector(
    getWarningByType(WarningType.GenesisIDMigrationFailed)
  );
  if (!warning) {
    return null;
  }
  const handleDismiss = () => {
    dispatch(omitWarning(warning));
  };

  const revealInFinder = (filePath: string) => () =>
    eventsService.showFileInFolder({ filePath });

  return (
    <ReactPortal modalId="spacemesh-genesis-id-migration-failed">
      <Modal
        header="Error"
        subHeader="Cannot move files under correct Genesis ID"
        width={600}
        height={450}
      >
        <ErrorMessage>
          <RedText>{warning.message}</RedText>
          {'\n\n'}
          <ul style={{ fontSize: '12px' }}>
            <li>Please, check and rename these files/directories:</li>
            <li>
              1.
              <Code onClick={revealInFinder(warning.payload.nodeConfig.prev)}>
                {warning.payload.nodeConfig.prev}
              </Code>
              &nbsp;&rarr;&nbsp;
              <Code onClick={revealInFinder(warning.payload.nodeConfig.next)}>
                {warning.payload.nodeConfig.next}
              </Code>
            </li>
            <li>
              2.
              <Code onClick={revealInFinder(warning.payload.nodeData.prev)}>
                {warning.payload.nodeData.prev}
              </Code>
              &nbsp;&rarr;&nbsp;
              <Code onClick={revealInFinder(warning.payload.nodeData.next)}>
                {warning.payload.nodeData.next}
              </Code>
            </li>
            <li style={{ marginTop: '1em' }}>
              Note: Smapp does not rename the PoS directory.
              <br />
              <RedText>
                Please, ensure that Smapp is using correct node-config and PoS
                data.
              </RedText>
            </li>
          </ul>
        </ErrorMessage>
        <ButtonsWrapper>
          <Button isPrimary={false} onClick={handleDismiss} text="DISMISS" />
        </ButtonsWrapper>
      </Modal>
    </ReactPortal>
  );
};

export default GenesisIDMigrationFailed;
