import { MutableRefObject } from 'react';
import { TX_STATE_LABELS } from '../../shared/constants';
import { HexString, TxState } from '../../shared/types';
import { deriveHRP } from '../../shared/utils';

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

export const getAbbreviatedAddress = (address: string) => {
  const hrp = deriveHRP(address) || '';
  return `${hrp}1...${address.slice(-8)}`;
};

export const getFormattedTimestamp = (
  timestamp: number | null,
  status?: TxState | null
): string => {
  if (timestamp) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const dateObj = new Date(timestamp);
    return dateObj.toLocaleDateString('en-US', options).replace(',', '');
  }
  return status ? TX_STATE_LABELS[status] : 'Calculating date';
};

export const getAddress = (key: string) =>
  key.length <= 44 ? key : key.substring(24);

export const validateAddress = (address: string): address is HexString => {
  const addressRegex = new RegExp(/^(\w+)1[a-zA-Z0-9]{45}$/);
  const r = addressRegex.test(address);
  return r;
};

export const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return '0';
  } else if (bytes > 0 && bytes < 1048576) {
    return `${parseFloat((bytes / 1024).toFixed(2))} KiB`;
  } else if (bytes >= 1048576 && bytes < 1073741824) {
    return `${parseFloat((bytes / 1048576).toFixed(2))} MiB`;
  } else if (bytes >= 1099511627776) {
    return `${parseFloat((bytes / 1099511627776).toFixed(2))} TiB`;
  }
  return `${parseFloat((bytes / 1073741824).toFixed(2))} GiB`;
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

// Truncates a number to a specified number of decimal places without rounding
const truncateToDecimalPlaces = (num: number, decimalPlaces: number) => {
  const numPower = 10 ** decimalPlaces;
  return Math.floor(num * numPower) / numPower;
};

const packValueAndUnit = (value: number, unit: string) => ({
  value: value.toString(),
  unit,
});

export const toSMH = (smidge: number) => smidge / 10 ** 9;
export const toSmidge = (smh: number) => Math.round(smh * 10 ** 9);

// Parses number into { value, unit } format.
// Used to format smidge strings
export const parseSmidge = (amount: number) => {
  // If amount is "falsy" (0 | undefined | null)
  if (!amount) return packValueAndUnit(0, CoinUnits.SMH);
  else if (amount >= 10 ** 9) {
    // Truncate to 3 decimal places without rounding
    const smhValue = truncateToDecimalPlaces(toSMH(amount), 3);
    return packValueAndUnit(smhValue, CoinUnits.SMH);
    // Or `6739412 Smidge` (without dot) for small amount
  } else if (!Number.isNaN(amount))
    return packValueAndUnit(amount, CoinUnits.Smidge);
  // Show `0 SMH` for zero amount and NaN
  else return packValueAndUnit(0, CoinUnits.SMH);
};

// Returns formatted display string for a smidge amount.
// All coin displayed in the app should display amount formatted
export const formatSmidge = (amount: number): string => {
  const { value, unit } = parseSmidge(amount);
  return `${value} ${unit}`;
};

export const constrain = (min: number, max: number, value: number) =>
  Math.min(Math.max(value, min), max);

export const safeReactKey = (str: string) => str.replace(/\s|\W/g, '');

export const setRef = (ref: MutableRefObject<HTMLElement | null>) => (
  el: HTMLElement | null
) => {
  ref.current = el;
};
