/* eslint-disable import/prefer-default-export */

export const goToSwitchNetwork = (history, isWalletOnly) =>
  setImmediate(() => {
    history.push('/auth/switch-network', { redirect: history.location.pathname, isWalletOnly });
  });
