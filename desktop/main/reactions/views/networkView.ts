import { objOf } from 'ramda';
import { combineLatest, map, Observable } from 'rxjs';
import parse from 'parse-duration';
import { Network, NetworkState, NodeConfig } from '../../../../shared/types';
import { generateGenesisIDFromConfig } from '../../Networks';

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Observable<NodeConfig>
) =>
  combineLatest([$currentNetwork, $nodeConfig]).pipe(
    map(
      ([curNet, nodeConfig]) =>
        <NetworkState>{
          genesisID: generateGenesisIDFromConfig(nodeConfig) || '',
          netName: curNet?.netName || 'Not connected',
          genesisTime: nodeConfig.genesis['genesis-time'],
          layerDurationSec: parse(nodeConfig.main['layer-duration'], 's'),
          layersPerEpoch: nodeConfig.main['layers-per-epoch'],
          explorerUrl: curNet?.explorer || '',
        }
    ),
    map(objOf('network'))
  );
