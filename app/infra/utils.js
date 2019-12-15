const fromHexString = (hexString) => {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};

const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

const createError = (message, func) => ({
  message,
  retryFunction: func
});

const getAbbreviatedText = (address: string, addPrefix: boolean = true, tailSize: number = 4) =>
  `${addPrefix ? '0x' : ''}${address.substring(0, tailSize)}...${address.substring(address.length - tailSize, address.length)}`;

const formatNumber = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

const smeshToSmidge = (amount: number) => amount * 10 ** 12;

const smidgeToSmesh = (amount: number) => amount / 10 ** 12;

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};

const getFormattedTimestamp = (timestamp: string) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateObj = new Date(timestamp);
  return `${dateObj.toLocaleDateString('en-US', options).replace(',', '')} - ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
};

export { fromHexString, toHexString, createError, getAbbreviatedText, formatNumber, smeshToSmidge, smidgeToSmesh, asyncForEach, getFormattedTimestamp };
