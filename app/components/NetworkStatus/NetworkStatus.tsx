import React from 'react';
import styled from 'styled-components';
import { NodeStartupState, NodeStatus } from '../../../shared/types';
import {
  ProgressBar,
  ColorStatusIndicator,
  Tooltip,
} from '../../basicComponents';
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
  isWalletMode: boolean;
  isShowMissingLibsMessage: boolean;
  atxsCount: number;
};

const getStartupStatusText = (startupStatus: NodeStartupState, atxsCount) => {
  switch (startupStatus) {
    case NodeStartupState.Starting:
      return 'Starting node...';
    case NodeStartupState.Compacting:
      return 'Compacting database...';
    case NodeStartupState.RunningMigrations:
      return 'Running database migrations...';
    case NodeStartupState.InitializingTortoise:
      return 'Initializing Tortoise...';
    case NodeStartupState.PreparingCache:
      return 'Preparing node cache...';
    case NodeStartupState.Vacuuming:
      return 'Vacuuming database...';
    case NodeStartupState.VerifyingLayers:
      return 'Tortoise verifying layers...';
    case NodeStartupState.SyncingAtxs:
      return (
        <>
          {atxsCount > 0
            ? `Syncing Activations (${atxsCount})...`
            : 'Syncing Activations...'}
          <Tooltip
            width={200}
            marginTop={-2}
            text="This process is expected to take up to a few hours and you will see CPU usage increase during this time. Please be patient."
          />
        </>
      );
    case NodeStartupState.SyncingMaliciousProofs:
      return 'Syncing Malicious Proofs...';
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
  isWalletMode,
  isShowMissingLibsMessage,
  atxsCount,
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
    if (
      !status ||
      status.topLayer === 0 ||
      startupStatus !== NodeStartupState.Ready
    ) {
      return (
        <ProgressLabel>
          {getStartupStatusText(startupStatus, atxsCount)}
        </ProgressLabel>
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
      {isWalletMode ? (
        <ProgressLabel>Connection error</ProgressLabel>
      ) : (
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
      )}
    </>
  );

  return error ? renderError() : renderSyncingStatus();
};

export default NetworkStatus;
