import { Observable, shareReplay } from 'rxjs';
import StoreService, { ConfigStore } from '../../storeService';

const observeStoreService = () =>
  new Observable<ConfigStore>((subscribe) => {
    subscribe.next(StoreService.dump());
    StoreService.onAnyChange(() => {
      subscribe.next(StoreService.dump());
    });
  }).pipe(shareReplay());

export default observeStoreService;
