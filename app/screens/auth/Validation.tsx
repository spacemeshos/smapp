// eslint-disable-next-line import/prefer-default-export
export const validationWalletName = (walletName: string) => {
  // default wallet name
  if (walletName === '') {
    return '';
  }

  const nameCheck = /^([A-Za-z0-9-_ ])+$/;

  if (walletName.length > 31) {
    return 'Wallet name must not exceed 31 characters';
  }

  const isEmpty = walletName.replaceAll(' ', '').length === 0;

  if (!nameCheck.test(walletName) || isEmpty) {
    return 'Only latin letters, numbers, space, _ and - are accepted';
  }

  return '';
};
