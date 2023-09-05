import React from 'react';
import styled from 'styled-components';
import { NodeStatus } from '../../../shared/types';
import { ProgressBar, ColorStatusIndicator } from '../../basicComponents';
import { constrain } from '../../infra/utils';
import { smColors } from '../../vars';

const ProgressLabel = styled.div`
  margin-left: 10px;
  text-transform: uppercase;
`;

const Progress = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin-left: 20px;
`;

type Props = {
  status: NodeStatus | null;
  error: any;
  isGenesis: boolean;
  isRestarting: boolean;
  isWalletMode: boolean;
  isLibsNotInstalled: boolean;
};

const NetworkStatus = ({
  status,
  error,
  isGenesis,
  isRestarting,
  isWalletMode,
  isLibsNotInstalled,
}: Props) => {
  const getSyncLabelPercentage = (): number => {
    if (status && status.verifiedLayer && status.topLayer) {
      const percentage = Math.floor(
        (status.verifiedLayer * 100) / status.topLayer
      );
      const maxPercentage = status.isSynced ? 100 : 99;
      return constrain(0, maxPercentage, percentage);
    }
    return 0;
  };

  const getSyncProgress = () => {
    if (!status || status.topLayer === 0) {
      return <ProgressLabel>Connecting...</ProgressLabel>;
    }

    const verifiedLayer = status.verifiedLayer || 0;
    const topLayer = status.topLayer || 0;

    if (isGenesis) {
      const progress = Math.floor((topLayer / verifiedLayer) * 100);
      return (
        <>
          <ProgressLabel>Genesis</ProgressLabel>
          <ProgressLabel>{progress}%</ProgressLabel>
          <ProgressLabel>{`${topLayer} / ${verifiedLayer}`}</ProgressLabel>
          <Progress>
            <ProgressBar progress={progress} />
          </Progress>
        </>
      );
    }

    const progress = getSyncLabelPercentage();
    return (
      <>
        <ProgressLabel>syncing</ProgressLabel>
        <ProgressLabel>{progress}%</ProgressLabel>
        <ProgressLabel>{`${verifiedLayer} / ${topLayer}`}</ProgressLabel>
        <Progress>
          <ProgressBar progress={progress} />
        </Progress>
      </>
    );
  };

  const renderSyncingStatus = () => {
    return (
      <>
        {status?.isSynced && status.verifiedLayer - status.topLayer <= 2 ? (
          <>
            <ColorStatusIndicator color={smColors.green} />
            <ProgressLabel>synced</ProgressLabel>
          </>
        ) : (
          <>
            <ColorStatusIndicator
              color={status?.isSynced ? smColors.green : smColors.orange}
            />
            {getSyncProgress()}
          </>
        )}
      </>
    );
  };

  const renderError = () => (
    <>
      <ColorStatusIndicator color={smColors.red} />
      {isWalletMode ? (
        <ProgressLabel>Connection error</ProgressLabel>
      ) : (
        <ProgressLabel>
          {isRestarting
            ? 'Restarting node...'
            : isLibsNotInstalled
            ? 'Please install libs and restart node'
            : 'Please restart node'}
        </ProgressLabel>
      )}
    </>
  );

  return error ? renderError() : renderSyncingStatus();
};

export default NetworkStatus;
