import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { WarningType } from '../../../shared/warning';
import { Button, Link } from '../../basicComponents';
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

const CannotFetchConfigsError = () => {
  const dispatch = useDispatch();
  const warning = useSelector(
    getWarningByType(WarningType.CannotLoadConfigsFromDiscovery)
  );

  if (!warning) {
    return null;
  }
  const showDir = () => {
    eventsService.showFileInFolder({
      filePath: warning.payload.dir,
    });
  };

  const handleDismiss = () => {
    dispatch(omitWarning(warning));
  };

  const openDiscovery = () => window.open(warning.payload.url);

  const subheader =
    warning.payload.type === 'networks'
      ? 'Cannot load networks list'
      : 'Cannot load the network config';

  const predescription = warning.payload.cacheHit
    ? 'Application is using configs that were downloaded earlier.'
    : 'Cannot fetch required data from the internet and does not have cached files.';

  return (
    <ReactPortal modalId="spacemesh-folder-permission">
      <Modal header="Error" subHeader={subheader} width={600} height={450}>
        <ErrorMessage>
          <RedText>
            Error occured during downloading the file:{'\n'}
            {warning.message}
          </RedText>
          {'\n\n'}
          {predescription}
          {'\n\n'}

          {warning.payload.cacheHit
            ? 'To update cached configs try to:'
            : 'Follow these steps:'}
          <ol>
            <li>
              1. manually download fresh configs from
              <Link
                onClick={openDiscovery}
                text="the&nbsp;discovery&nbsp;service"
                style={{ display: 'inline', margin: '0 0.6em' }}
              />
            </li>
            <li>
              2. put them into
              <Link
                onClick={showDir}
                text="ConfigCache&nbsp;directory"
                style={{ display: 'inline', margin: '0 0.6em' }}
              />
            </li>
            <li>3. restart Smapp.</li>
          </ol>
        </ErrorMessage>
        <ButtonsWrapper>
          <Button isPrimary={false} onClick={handleDismiss} text="DISMISS" />
        </ButtonsWrapper>
      </Modal>
    </ReactPortal>
  );
};

export default CannotFetchConfigsError;
