import { HexString } from '../../shared/types';

export const addErrorPrefix = (prefix: string, error: Error) => {
  error.message = `${prefix}${error.message}`;
  return error;
};

export const has0x = (addr: string) => addr.indexOf('0x') === 0;
export const ensure0x = (addr: string) => (!has0x(addr) ? `0x${addr}` : addr);
export const trim0x = (addr: string) => (has0x(addr) ? addr.substr(2) : addr);

export const getAbbreviatedText = (
  address: string,
  addPrefix = true,
  tailSize = 4
) => {
  const hexOnly = trim0x(address);
  const abbr = `${hexOnly.substr(0, tailSize)}...${hexOnly.substr(
    -tailSize
  )}`.toUpperCase();
  return addPrefix ? ensure0x(abbr) : abbr;
};

export const getFormattedTimestamp = (timestamp: number | null): string => {
  if (timestamp) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', options).replace(',', '');
  }
  return 'Pending';
};

export const getAddress = (key: string) =>
  key.length <= 44 ? key : key.substring(24);

// Address can start with `0x` or without
// By default it checks the account address, length = 40
// To validate tx / smesher address, set length to 64
export const validateAddress = (
  address: string,
  length = 40
): address is HexString => {
  const r = new RegExp(`^(0x)?[a-f0-9]{${length}}$`, 'i').test(address);
  return r;
};

export const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return '0';
  } else if (bytes > 0 && bytes < 1048576) {
    return `${parseFloat((bytes / 1024).toFixed(2))} KB`;
  } else if (bytes >= 1048576 && bytes < 1073741824) {
    return `${parseFloat((bytes / 1048576).toFixed(2))} MB`;
  } else if (bytes >= 1099511627776) {
    return `${parseFloat((bytes / 1099511627776).toFixed(2))} TB`;
  }
  return `${parseFloat((bytes / 1073741824).toFixed(2))} GB`;
};

export const formatWithCommas = (x: number) =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// -------------------
// Units
// -------------------

export enum CoinUnits {
  SMH = 'SMH',
  Smidge = 'Smidge',
}

const packValueAndUnit = (value: number, unit: string) => ({
  value: parseFloat(value.toFixed(3)).toString(),
  unit,
});

export const toSMH = (smidge: number) => smidge / 10 ** 12;
export const toSmidge = (smh: number) => Math.ceil(smh * 10 ** 12);

// Internal helper - returns the value and the unit of a smidge coin amount.
// Used to format smidge strings
export const getValueAndUnit = (amount: number) => {
  // Show `23.053 SMH` for big amount
  if (amount >= 10 ** 9) return packValueAndUnit(toSMH(amount), CoinUnits.SMH);
  // Or `6739412 Smidge` (without dot) for small amount
  else if (!Number.isNaN(amount))
    return packValueAndUnit(amount, CoinUnits.Smidge);
  // Show `0 SMH` for zero amount and NaN
  else return packValueAndUnit(0, CoinUnits.SMH);
};

// Returns formatted display string for a smidge amount.
// All coin displayed in the app should display amount formatted
export const formatSmidge = (
  amount: number,
  separateResult?: boolean
): string | { value: string; unit: string } => {
  const res = getValueAndUnit(amount);
  return separateResult
    ? { value: res.value, unit: res.unit }
    : `${res.value} ${res.unit}`;
};

export const constrain = (min: number, max: number, value: number) =>
  Math.min(Math.max(value, min), max);
