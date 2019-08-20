const fromHexString = (hexString) => {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};

const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const getWalletName = ({ walletNumber }) => (walletNumber > 0 ? `Wallet ${walletNumber}` : 'Main Wallet');

const getAccountName = ({ accountNumber }) => (accountNumber > 0 ? `Account ${accountNumber}` : 'Main Account');

const listenerCleanup = ({ ipcRenderer, channels }) => {
  if (channels && channels.length) {
    channels.forEach((channel) => {
      ipcRenderer.removeAllListeners(channel);
    });
  }
};

const createError = (message, func) => ({
  message,
  retryFunction: func
});

const getAbbreviatedText = (address: string, tailSize: number = 4) => `${address.substring(0, tailSize)}....${address.substring(address.length - tailSize, address.length)}`;

export { fromHexString, toHexString, getWalletAddress, getWalletName, getAccountName, listenerCleanup, createError, getAbbreviatedText };
export { fromHexString, toHexString, getWalletName, getAccountName, listenerCleanup, createError };
