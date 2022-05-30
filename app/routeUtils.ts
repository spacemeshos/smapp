/* eslint-disable import/prefer-default-export */

import { useHistory } from 'react-router';
import { AuthPath } from './routerPaths';

export const goToSwitchNetwork = (
  history: ReturnType<typeof useHistory>,
  isWalletOnly: boolean
) =>
  setImmediate(() => {
    if (history.location.pathname === AuthPath.SwitchNetwork) return;
    history.push(AuthPath.SwitchNetwork, {
      redirect: history.location.pathname,
      isWalletOnly,
    });
  });

export const goToSwitchAPI = (
  history: ReturnType<typeof useHistory>,
  isWalletOnly: boolean
) =>
  setImmediate(() => {
    if (history.location.pathname === AuthPath.ConnectToAPI) return;
    history.push(AuthPath.ConnectToAPI, {
      redirect: history.location.pathname,
      isWalletOnly,
    });
  });
