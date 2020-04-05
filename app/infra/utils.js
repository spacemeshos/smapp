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
  `${addPrefix && address.indexOf('0x') === -1 ? '0x' : ''}${address.substring(0, tailSize)}...${address.substring(address.length - tailSize, address.length)}`;

const formatTxId = (id) => id && `0x${id.substring(0, 6)}`;

const formatNumber = (num) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

// Internal helper - returns the value and the unit of a smidge coin amount.
// Used to format smidge strings
const getValueAndUnit = (amount: number) => {
  let v: number = 0;
  let unit = 'SMH';

  if (amount >= 10 ** 9) {
    v = amount / 10 ** 12;
  } else if (amount >= 10 ** 6) {
    v = amount / 10 ** 9;
    unit = 'GSMD';
  } else if (amount >= 10 ** 4) {
    v = amount / 10 ** 6;
    unit = 'MSMD';
  } else if (amount === 0) {
    // we want to show 0 balance in SMH units
    v = 0;
    unit = 'SMH';
  } else if (!Number.isNaN(amount) && typeof amount === 'number') {
    v = amount;
    unit = 'SMD';
  }

  // truncate to 3 decimals and truncate trailing fractional 0s
  const s = parseFloat(v.toFixed(3)).toString();
  return { value: s, unit };
};

// Returns formatted display string for a smidge amount.
// All coin displayed in the app should display amount formatted
const formatSmidge = (amount: number, separateResult) => {
  const res = getValueAndUnit(parseInt(amount));
  return separateResult ? { value: res.value, unit: res.unit } : `${res.value} ${res.unit}`;
};

const testGetValueAndUnit = () => {
  let res = getValueAndUnit(0);
  if (res.unit !== 'SMH' || res.value !== 0) {
    console.error(`test failed. expected 0 SMH: ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(2.5 * 10 ** 12);
  if (res.unit !== 'SMH' || res.value !== 2.5) {
    console.error(`test failed. expected 2.5 SMH: ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 12);
  if (res.unit !== 'SMH' || res.value !== 1) {
    console.error(`test failed. expected 1 SMH${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 11);
  if (res.unit !== 'SMH' || res.value !== 0.1) {
    console.error(`test failed. expected 0.1 SMH${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 10);
  if (res.unit !== 'SMH' || res.value !== 0.01) {
    console.error(`test failed. expected 0.01 SMH${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 9);
  if (res.unit !== 'SMH' || res.value !== 0.001) {
    console.error(`test failed. expected 0.001 SMH. ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 8);
  if (res.unit !== 'GSMD' || res.value !== 0.1) {
    console.error(`test failed. expected 0.1 GSMD. ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 7);
  if (res.unit !== 'GSMD' || res.value !== 0.01) {
    console.error(`test failed. expected 0.01 GSMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 6);
  if (res.unit !== 'GSMD' || res.value !== 0.001) {
    console.error(`test failed. expected 0.001 GSMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 5);
  if (res.unit !== 'MSMD' || res.value !== 0.1) {
    console.error(`test failed. expected 0.1 MSMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 4);
  if (res.unit !== 'MSMD' || res.value !== 0.01) {
    console.error(`test failed. expected 0.01 MSMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 3);
  if (res.unit !== 'SMD' || res.value !== 1000) {
    console.error(`test failed. expected 1000 SMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10 ** 2);
  if (res.unit !== 'SMD' || res.value !== 100) {
    console.error(`test failed. expected 100 SMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(10);
  if (res.unit !== 'SMD' || res.value !== 10) {
    console.error(`test failed. expected 10 SMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console

  res = getValueAndUnit(1);
  if (res.unit !== 'SMD' || res.value !== 1) {
    console.error(`test failed. expected 1 SMD ${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
  }
  console.log(`${res.value.toString()} ${res.unit}`); // eslint-disable-line no-console
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};

const getFormattedTimestamp = (timestamp: string) => {
  if (timestamp) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', options).replace(',', '');
  }
  return null;
};

const getAddress = (key: string) => (key ? key.substring(24) : null);

const formatBytes = (bytes) => {
  if (bytes === 0) return 0;
  return parseFloat((bytes / 1073741824).toFixed(4));
};

export {
  testGetValueAndUnit,
  formatSmidge,
  fromHexString,
  toHexString,
  createError,
  getAbbreviatedText,
  formatNumber,
  asyncForEach,
  getFormattedTimestamp,
  getAddress,
  formatTxId,
  formatBytes
};
