import { objOf } from 'ramda';
import { combineLatest, map, Observable } from 'rxjs';
import { Network, NodeConfig } from '../../../../shared/types';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Observable<NodeConfig>
) =>
  combineLatest([$currentNetwork, $nodeConfig]).pipe(
    map(([curNet, nodeConfig]) => ({
      netId: curNet?.netID || -1,
      netName: curNet?.netName || 'Not connected',
      genesisTime: nodeConfig.main['genesis-time'],
      layerDurationSec: nodeConfig.main['layer-duration-sec'],
      explorerUrl: curNet?.explorer || '',
    })),
    map(objOf('network'))
  );
