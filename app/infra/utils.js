const fromHexString = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const getWalletAddress = (address: string) => {
  const addressUint8Array = fromHexString(address);
  return addressUint8Array.slice(0, 20);
};

export { fromHexString, toHexString, getWalletAddress };
