// eslint-disable-next-line import/prefer-default-export
export const validationWalletName = (walletName: string) => {
  if (walletName === '') {
    return '';
  }

  const nameCheck = /^([a-z0-9-_])/;

  if (walletName.length > 31) {
    return 'Wallet name must not exceed 31 characters';
  }

  if (!nameCheck.test(walletName) || walletName.toLowerCase() !== walletName) {
    return 'Must contain only lowercase letters, numbers and _ or -';
  }

  return '';
};
