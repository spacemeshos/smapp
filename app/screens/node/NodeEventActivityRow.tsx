import React from 'react';
import { NodeEvent } from '../../../shared/types';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { getEventType } from '../../../shared/utils';
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

export default (event: NodeEvent) => {
  if (event && event.failure) {
    return (
      <ErrorMessage>
        Stage &quot;{getNodeEventStage(event)}&quot; failed. Check the logs for{' '}
        more details.
      </ErrorMessage>
    );
  }
  if (!event) {
    return 'Node is preparing...';
  }
  switch (getEventType(event)) {
    case 'initStart':
      return 'Started PoST data initialization';
    case 'initComplete':
      return 'Completed PoST data initialization';
    case 'initFailed':
      return 'PoST data initialization failed';
    case 'poetWaitRound':
      return withTime(
        'Waiting for PoET registration window',
        event.timestamp,
        event.poetWaitRound?.wait
      );
    case 'poetWaitProof': {
      return withTime(
        `Waiting for the finish of PoET round${
          event?.poetWaitProof?.publish
            ? ` for epoch ${event.poetWaitProof.publish}`
            : ''
        }`,
        event.timestamp,
        event.poetWaitProof?.wait
      );
    }
    case 'postStart':
      return "Generating PoST proof for the PoET's challenge";
    case 'postComplete':
      return 'Finished generating PoST proof';
    case 'atxPublished':
      return 'Published activation. Waiting for the next epoch';
    case 'eligibilities':
      return event?.eligibilities?.eligibilities
        ? `Eligible for rewards in layers ${event.eligibilities.eligibilities
            .map((el) => el.layer)
            .join(', ')}`
        : `Computed eligibilities for the epoch ${
            event.eligibilities?.epoch || ''
          }`;
    case 'proposal':
      return `Published proposal on layer ${event.proposal?.layer}`;
    case 'beacon':
      return `Node computed randomness beacon for epoch ${event.beacon?.epoch}`;
    default:
      return event.help ?? 'Node is preparing...';
  }
};
