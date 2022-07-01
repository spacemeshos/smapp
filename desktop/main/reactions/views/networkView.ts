import { objOf } from 'ramda';
import { combineLatest, map, Observable } from 'rxjs';
import { Network, NetworkState, NodeConfig } from '../../../../shared/types';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Observable<NodeConfig>,
  $currentLayer: Observable<number>,
  $rootHash: Observable<string>
) =>
  combineLatest([$currentNetwork, $nodeConfig, $currentLayer, $rootHash]).pipe(
    map(
      ([curNet, nodeConfig, currentLayer, rootHash]) =>
        <NetworkState>{
          netId: curNet?.netID || -1,
          netName: curNet?.netName || 'Not connected',
          genesisTime: nodeConfig.main['genesis-time'],
          layerDurationSec: nodeConfig.main['layer-duration-sec'],
          layersPerEpoch: nodeConfig.main['layers-per-epoch'],
          explorerUrl: curNet?.explorer || '',
          currentLayer,
          rootHash,
        }
    ),
    map(objOf('network'))
  );
