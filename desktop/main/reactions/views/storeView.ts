import { objOf } from 'ramda';
import { map, Observable } from 'rxjs';
import { remap } from '../../../../shared/utils';
import { ConfigStore } from '../../../storeService';

export default ($storeService: Observable<ConfigStore>) =>
  $storeService.pipe(
    map(
      remap({
        dataPath: ['node', 'dataPath'],
        port: ['node', 'port'],
      })
    ),
    map(objOf('store'))
  );
