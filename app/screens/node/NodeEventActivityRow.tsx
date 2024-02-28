import React from 'react';
import { NodeEvent } from '../../../shared/types';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { getEventType, toHexString } from '../../../shared/utils';
import { CustomTimeAgo } from '../../basicComponents';
import Address, { AddressType } from '../../components/common/Address';
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

const ensureSmesherIdType = (s: string | Buffer | Uint8Array | undefined) => {
  if (!s) return null;
  if (typeof s === 'string') return s;
  return toHexString(s);
};

export default (event: NodeEvent) => {
  if (event && event.failure) {
    return <ErrorMessage>{getEventErrorMessage(event)}</ErrorMessage>;
  }
  if (!event) {
    return 'Node is connecting...';
  }
  switch (getEventType(event)) {
    case 'initStart': {
      const smesherId = ensureSmesherIdType(event.initStart?.smesher);
      if (!smesherId) {
        return 'Started PoS data initialization';
      } else {
        return (
          <>
            Started PoS data initialization for
            <Address type={AddressType.SMESHER} address={smesherId} isHex />
          </>
        );
      }
    }
    case 'initComplete':
      return 'Completed PoS data initialization';
    case 'initFailed':
      return 'PoS data initialization failed';
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
    case 'postStart': {
      const smesherId = ensureSmesherIdType(event.postStart?.smesher);
      if (!smesherId) {
        return "Generating PoST proof for the PoET's challenge";
      } else {
        return (
          <>
            Generating PoST proof for the PoET&apos;s challenge for
            <Address type={AddressType.SMESHER} address={smesherId} isHex />
          </>
        );
      }
    }
    case 'postComplete': {
      const smesherId = ensureSmesherIdType(event.postComplete?.smesher);
      if (!smesherId) {
        return 'Finished generating PoST proof';
      } else {
        return (
          <>
            Finished generating PoST proof for
            <Address type={AddressType.SMESHER} address={smesherId} isHex />
          </>
        );
      }
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
    default:
      return event.help ?? 'Node is preparing...';
  }
};
