import React from 'react';
import styled from 'styled-components';
import { NodeStatus } from '../../../shared/types';
import { NetworkIndicator, ProgressBar } from '../../basicComponents';
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
};

const NetworkStatus = ({ status, error }: Props) => {
  const getSyncLabelPercentage = (): number => {
    if (status && status.syncedLayer && status.topLayer) {
      const percentage = Math.round((status.syncedLayer * 100) / status.topLayer);
      return constrain(0, 100, percentage);
    }
    return 0;
  };

  const renderSyncingStatus = () => {
    const progress = getSyncLabelPercentage();
    return (
      <>
        {status?.isSynced ? (
          <>
            <NetworkIndicator color={smColors.green} />
            <ProgressLabel>synced</ProgressLabel>
          </>
        ) : (
          <>
            <NetworkIndicator color={status?.isSynced ? smColors.green : smColors.orange} />
            <ProgressLabel>syncing</ProgressLabel>
            <ProgressLabel>{progress}%</ProgressLabel>
            <ProgressLabel>{`${status?.syncedLayer || 0} / ${status?.topLayer || 0}`}</ProgressLabel>
            <Progress>
              <ProgressBar progress={progress} />
            </Progress>
          </>
        )}
      </>
    );
  };

  const renderError = () => (
    <>
      <NetworkIndicator color={smColors.red} />
      <ProgressLabel>Please restart node</ProgressLabel>
    </>
  );

  return error ? renderError() : renderSyncingStatus();
};

export default NetworkStatus;
