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
  isRestarting: boolean;
  isWalletMode: boolean;
};

const NetworkStatus = ({
  status,
  error,
  isRestarting,
  isWalletMode,
}: Props) => {
  const getSyncLabelPercentage = (): number => {
    if (status && status.syncedLayer && status.topLayer) {
      const percentage = Math.floor(
        (status.syncedLayer * 100) / status.topLayer
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

    const syncedLayer = status.syncedLayer || 0;
    const topLayer = status.topLayer || 0;

    if (topLayer < syncedLayer) {
      const progress = Math.floor((topLayer / syncedLayer) * 100);
      return (
        <>
          <ProgressLabel>Genesis</ProgressLabel>
          <ProgressLabel>{progress}%</ProgressLabel>
          <ProgressLabel>{`${topLayer} / ${syncedLayer}`}</ProgressLabel>
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
        <ProgressLabel>{`${syncedLayer} / ${topLayer}`}</ProgressLabel>
        <Progress>
          <ProgressBar progress={progress} />
        </Progress>
      </>
    );
  };

  const renderSyncingStatus = () => {
    return (
      <>
        {status?.isSynced && status.topLayer === status.syncedLayer ? (
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
          {isRestarting ? 'Restarting node...' : 'Please restart node'}
        </ProgressLabel>
      )}
    </>
  );

  return error ? renderError() : renderSyncingStatus();
};

export default NetworkStatus;
