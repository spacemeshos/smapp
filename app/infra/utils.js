const fromHexString = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

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

export { fromHexString, toHexString, getWalletName, getAccountName, listenerCleanup };
