import React from 'react';
import { NodeEvent } from '../../../shared/types';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { getEventType, longToNumber } from '../../../shared/utils';
import { CustomTimeAgo } from '../../basicComponents';
import { getNodeEventStage } from './nodeEventUtils';

const withTime = (str: string, now: number, wait?: number) =>
  !wait ? (
    str
  ) : (
    <>
      {str}{' '}
      <CustomTimeAgo
        time={now + wait}
        dict={{
          prefixAgo: 'in',
          prefixFromNow: 'in',
          suffixAgo: 'ago',
          suffixFromNow: null,
          seconds: '%d seconds',
        }}
      />
    </>
  );

const getEventErrorMessage = (event: NodeEvent) => {
  switch (getEventType(event)) {
    case 'initFailed':
      return `PoS data initialization failed: ${event.initFailed?.error}`;
    default:
      return `Stage "${getNodeEventStage(
        event
      )}" failed. Check the logs for more details.`;
  }
};

export default (event: NodeEvent) => {
  if (event && event.failure) {
    return <ErrorMessage>{getEventErrorMessage(event)}</ErrorMessage>;
  }
  if (!event) {
    return 'Node is connecting...';
  }
  const now = Date.now();
  switch (getEventType(event)) {
    case 'initStart': {
      return 'Started PoS data initialization';
    }
    case 'initComplete':
      return 'Completed PoS data initialization';
    case 'initFailed':
      return 'PoS data initialization failed';
    case 'postStart': {
      return "Generating PoST proof for the PoET's challenge";
    }
    case 'postComplete': {
      return 'Finished generating PoST proof';
    }
    case 'atxPublished':
      return 'Published activation. Waiting for the next epoch';
    case 'eligibilities':
      return event?.eligibilities?.eligibilities
        ? `Eligible for rewards in layers ${event.eligibilities.eligibilities
            .map((el) => el.layer)
            .sort((a, b) => (a || 0) - (b || 0))
            .join(', ')}`
        : `Computed eligibilities for the epoch ${
            event.eligibilities?.epoch || ''
          }`;
    case 'proposal':
      return `Published proposal on layer ${event.proposal?.layer}`;
    case 'beacon':
      return `Node computed randomness beacon for epoch ${event.beacon?.epoch}`;
    case 'waitingForPoetRegistrationWindow': {
      // API returns absolute time
      const roundEnd =
        typeof event.waitingForPoetRegistrationWindow?.roundEnd?.seconds ===
        'string'
          ? parseInt(
              event.waitingForPoetRegistrationWindow?.roundEnd?.seconds,
              10
            )
          : event.waitingForPoetRegistrationWindow?.roundEnd?.seconds;
      const until = roundEnd ? longToNumber(roundEnd) * 1000 : now;
      return withTime(
        `Waiting for PoET registration window in epoch ${
          event.waitingForPoetRegistrationWindow?.publish ?? ''
        } to open`,
        now,
        until - now
      );
    }
    case 'waitingForPoetRoundEnd': {
      // API returns absolute time
      const roundEnd =
        typeof event.waitingForPoetRoundEnd?.roundEnd?.seconds === 'string'
          ? parseInt(event.waitingForPoetRoundEnd?.roundEnd?.seconds, 10)
          : event.waitingForPoetRoundEnd?.roundEnd?.seconds;
      const until = roundEnd ? longToNumber(roundEnd) * 1000 : now;

      return withTime(
        `Waiting for the finish of PoET round for epoch ${
          event.waitingForPoetRoundEnd?.publish ?? ''
        }. Round ends in`,
        now,
        until - now
      );
    }
    case 'bestProofSelected': {
      const ticks = longToNumber(
        typeof event.bestProofSelected?.ticks === 'string'
          ? parseInt(event.bestProofSelected?.ticks, 10)
          : event.bestProofSelected?.ticks ?? 0
      );
      return `The best PoET proof is selected for round ${
        event.bestProofSelected?.roundId ?? ''
      }: ${ticks} ticks ${
        event.bestProofSelected?.url
          ? `(URL: ${event.bestProofSelected?.url})`
          : ''
      }`;
    }
    case 'registeredInPoet':
      return `Registered in PoET. Round ID: ${event.registeredInPoet?.roundId}`;
    // Deprecated
    case 'poetWaitProof':
    case 'poetWaitRound': {
      return null;
    }
    default:
      return event.help ?? 'Node is preparing...';
  }
};
