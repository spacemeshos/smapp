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
  } else {
    v = amount;
    unit = 'SMD';
  }
  return { value: v, unit };
};

// Returns formatted display string for a smidge amount.
// All coin displayed in the app should display amount formatted
const formatSmidge = (amount: number) => {
  const res = getValueAndUnit(amount);
  return `${res.value} ${res.unit}`;
};

const testGetValueAndUnit = () => {
  let res = getValueAndUnit(2.5 * 10 ** 12);
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
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleDateString('en-US', options).replace(',', '');
};

const getAddress = (key: string) => key.substring(24);

export {
  testGetValueAndUnit,
  formatSmidge,
  fromHexString,
  toHexString,
  createError,
  getAbbreviatedText,
  formatNumber,
  smeshToSmidge,
  smidgeToSmesh,
  asyncForEach,
  getFormattedTimestamp,
  getAddress
};
