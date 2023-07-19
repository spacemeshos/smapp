import { NodeEvent } from '../../../shared/types';
import { getEventType } from '../../../shared/utils';
import { smColors } from '../../vars';

export const getNodeEventStage = (event: NodeEvent) => {
  switch (getEventType(event)) {
    case 'initStart':
      return 'PoST data initialization';
    case 'initComplete':
      return 'PoST data initialization complete';
    case 'initFailed':
      return 'PoST data initialization';
    case 'poetWaitRound':
      return 'Waiting for PoET registration';
    case 'poetWaitProof':
      return 'Waiting for PoET proof';
    case 'postStart':
      return 'PoST proof generation';
    case 'postComplete':
      return 'Generating PoST proof complete';
    case 'atxPublished':
      return 'Publishing activation';
    case 'eligibilities':
      return 'Calculating eleigibilities';
    case 'proposal':
      return 'Publishing proposal';
    case 'beacon':
      return 'Generating beacon';
    default:
      return `Unknown "${getEventType(event)}"`;
  }
};

export const getNodeEventStatusColor = (event: NodeEvent) => {
  if (event && event.failure) {
    return smColors.red;
  }
  switch (getEventType(event)) {
    case 'initComplete':
    case 'postComplete':
    case 'proposal':
      return smColors.green;
    default:
      return smColors.mediumGray;
  }
};
