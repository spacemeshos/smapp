import React from 'react';
import styled from 'styled-components';
import { NodeStartupState, NodeStatus } from '../../../shared/types';
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
  startupStatus: NodeStartupState;
  status: NodeStatus | null;
  error: any;
  isGenesis: boolean;
  isRestarting: boolean;
  isShowMissingLibsMessage: boolean;
};

const getStartupStatusText = (startupStatus: NodeStartupState) => {
  switch (startupStatus) {
    case NodeStartupState.Starting:
      return 'Starting node...';
    case NodeStartupState.Compacting:
      return 'Compacting database...';
    case NodeStartupState.Vacuuming:
      return 'Vacuuming database...';
    case NodeStartupState.StartingGRPC:
      return 'Starting GRPC server...';
    case NodeStartupState.VerifyingLayers:
      return 'Tortoise verifying layers...';
    default:
    case NodeStartupState.Ready:
      return 'Connecting to Node...';
  }
};

const NetworkStatus = ({
  startupStatus,
  status,
  error,
  isGenesis,
  isRestarting,
  isShowMissingLibsMessage,
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
      return (
        <ProgressLabel>{getStartupStatusText(startupStatus)}</ProgressLabel>
      );
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
      <ProgressLabel>
        {
          // eslint-disable-next-line no-nested-ternary
          isRestarting
            ? 'Restarting node...'
            : isShowMissingLibsMessage
            ? 'Please install required libraries and restart node'
            : 'Please restart node'
        }
      </ProgressLabel>
    </>
  );

  return error ? renderError() : renderSyncingStatus();
};

export default NetworkStatus;
