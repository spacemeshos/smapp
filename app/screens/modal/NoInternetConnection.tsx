import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../basicComponents';
import { ExternalLinks } from '../../../shared/constants';
import Modal from '../../components/common/Modal';
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
`;

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

const useNavigatorOnLine = () => {
  const [status, setStatus] = useState(getOnLineStatus());

  useEffect(() => {
    function setOnline() {
      setStatus(true);
    }
    function setOffline() {
      setStatus(false);
    }
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, [setStatus]);

  return status;
};

const NoInternetConnection = () => {
  const navigateToDiscord = () => window.open(ExternalLinks.Discord);
  const [isIgnore, setIgnore] = useState(false);
  const isOnline = useNavigatorOnLine();

  if (isOnline || isIgnore) {
    return null;
  }

  return (
    <ReactPortal modalId="no-internet-connection">
      <Modal header="NO INTERNET CONNECTION" width={600} height={350}>
        <ErrorMessage>
          Please, check your internet connection. Once you&apos;ll get connected
          this dialog should disappear automatically.
          {'\n'}
          However, you can unlock the wallet even without an internet
          connection. Then click the &quot;Ignore&quot; button and unlock the
          wallet as usual.
        </ErrorMessage>
        <ButtonsWrapper>
          <Button
            isPrimary={false}
            onClick={navigateToDiscord}
            text="OPEN DISCORD CHANNEL"
            width={180}
          />
          <Button onClick={() => setIgnore(true)} text="IGNORE" />
        </ButtonsWrapper>
      </Modal>
    </ReactPortal>
  );
};

export default NoInternetConnection;
