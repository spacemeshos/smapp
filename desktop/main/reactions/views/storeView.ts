import { applySpec, objOf, path } from 'ramda';
import { map, Observable } from 'rxjs';
import { ConfigStore } from '../../../storeService';

export default ($storeService: Observable<ConfigStore>) =>
  $storeService.pipe(
    map(
      applySpec({
        dataPath: path(['node', 'dataPath']),
        port: path(['node', 'port']),
      })
    ),
    map(objOf('store'))
  );
