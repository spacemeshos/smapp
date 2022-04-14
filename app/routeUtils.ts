/* eslint-disable import/prefer-default-export */

import { AuthPath } from './routerPaths';

export const goToSwitchNetwork = (history, isWalletOnly) =>
  setImmediate(() => {
    history.push(AuthPath.SwitchNetwork, { redirect: history.location.pathname, isWalletOnly });
  });
