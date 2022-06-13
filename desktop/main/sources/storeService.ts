import { Observable } from 'rxjs';
import StoreService, { ConfigStore } from '../../storeService';

const observeStoreService = () =>
  new Observable<ConfigStore>((subscribe) => {
    subscribe.next(StoreService.dump());
    StoreService.onAnyChange(() => {
      subscribe.next(StoreService.dump());
    });
  });

export default observeStoreService;
