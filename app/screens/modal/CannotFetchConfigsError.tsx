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

const Block = styled.span`
  display: block;
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

  const renderContents = () => {
    if (warning.payload.cacheHit) {
      return (
        <Modal
          header="Using cached configs"
          subHeader={
            <>
              {warning.payload.type === 'networks'
                ? 'Cannot load the fresh networks list.'
                : 'Cannot load the fresh network config.'}
              <br />
              The node is using the previously downloaded config.
            </>
          }
          width={600}
          height={480}
        >
          <ErrorMessage>
            <Block>Error: {warning.message}</Block>
            {'\n'}
            Keep the Smapp online, no need to restart the application or node.
            {'\n\n'}
            Only if you need to update the config, please follow these steps:
            {'\n'}
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
      );
    }
    return (
      <Modal
        header="Error"
        subHeader={
          warning.payload.type === 'networks'
            ? 'Cannot load the networks list'
            : 'Cannot load the network config'
        }
        width={600}
        height={480}
      >
        <ErrorMessage>
          <RedText>
            Smapp cannot reach the config service:{'\n'}
            {warning.message}
          </RedText>
          {'\n\n'}
          Cannot fetch required data from the internet and does not have cached
          files.
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
    );
  };

  return (
    <ReactPortal modalId="spacemesh-folder-permission">
      {renderContents()}
    </ReactPortal>
  );
};

export default CannotFetchConfigsError;
