const fromHexString = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const getWalletAddress = (address: string) => {
  const addressUint8Array = fromHexString(address);
  return addressUint8Array.slice(12);
};

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
