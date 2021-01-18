import React from 'react';
import styled from 'styled-components';
import { NetworkIndicator, ProgressBar } from './index';

const ProgressLabel = styled.div`
  margin-left: 10px;
`;

const Progress = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin-left: 20px;
`;

type Props = {
  nodeIndicator: { hasError: boolean; color: string; message: string; statusText: string };
  status?: any;
};

const NetworkStatus = ({ nodeIndicator, status }: Props) => {
  const getSyncLabelPercentage = (): number => {
    if (status && status.syncedLayer && status.currentLayer) {
      return Math.round((parseInt(status.syncedLayer) * 100) / parseInt(status.currentLayer));
    }
    return 0;
  };

  const renderSyncingStatus = () => {
    const progress = getSyncLabelPercentage();
    return (
      <>
        {progress === 100 ? (
          <>
            <NetworkIndicator color={nodeIndicator.color} />
            <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
          </>
        ) : (
          <>
            <NetworkIndicator color={nodeIndicator.color} />
            <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
            <ProgressLabel>{getSyncLabelPercentage()}%</ProgressLabel>
            <ProgressLabel>{`${status?.syncedLayer || 0} / ${status?.currentLayer || 0}`}</ProgressLabel>
            <Progress>
              <ProgressBar progress={progress} />
            </Progress>
          </>
        )}
      </>
    );
  };

  const renderStatus = () => (
    <>
      <NetworkIndicator color={nodeIndicator.color} />
      <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
    </>
  );

  return nodeIndicator.hasError ? renderStatus() : renderSyncingStatus();
};

export default NetworkStatus;
