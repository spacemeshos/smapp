import { eventsService } from '../../infra/eventsService';
import createIpcAction from '../createIpcAction';

export const [getNetworkDefinitions, attachNetworkDefinitions] = createIpcAction('network/getNetworkDefinitions', eventsService.getNetworkDefinitions);
export const [getCurrentLayer, attachCurrentLayer] = createIpcAction('network/getCurrentLayer', eventsService.getCurrentLayer);
export const [getGlobalStateHash, attachGlobalStateHash] = createIpcAction('network/getGlobalStateHash', () =>
  eventsService
    .getGlobalStateHash()
    .then(({ rootHash }) => ({ rootHash: rootHash || '' }))
    .catch(() => ({ rootHash: '' }))
);
