export const addErrorPrefix = (prefix: string, error: Error) => {
  error.message = `${prefix}${error.message}`;
  return error;
};

export const getAbbreviatedText = (address: string, addPrefix = true, tailSize = 4) =>
  `${addPrefix && address.indexOf('0x') === -1 ? '0x' : ''}${address.substring(0, tailSize)}...${address.substring(address.length - tailSize, address.length)}`;

export const getFormattedTimestamp = (timestamp: number) => {
  if (timestamp) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateObj = new Date(timestamp);
    // @ts-ignore
    return dateObj.toLocaleDateString('en-US', options).replace(',', '');
  }
  return null;
};

export const getAddress = (key: string) => key.substring(24);

export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0';
  if (bytes >= 1099511627776) {
    return `${parseFloat((bytes / 1099511627776).toFixed(2))} TB`;
  }
  return `${parseFloat((bytes / 1073741824).toFixed(2))} GB`;
};

// -------------------
// Units
// -------------------

export enum CoinUnits {
  SMH = 'SMH',
  Smidge = 'Smidge'
}

const packValueAndUnit = (value: number, unit: string) => ({
  value: parseFloat(value.toFixed(3)).toString(),
  unit
});

export const toSMH = (smidge: number) => smidge / 10 ** 12;
export const toSmidge = (smh: number) => Math.ceil(smh * 10 ** 12);

// Internal helper - returns the value and the unit of a smidge coin amount.
// Used to format smidge strings
export const getValueAndUnit = (amount: number) => {
  // Show `23.053 SMH` for big amount
  if (amount >= 10 ** 9) return packValueAndUnit(toSMH(amount), CoinUnits.SMH);
  // Or `6739412 Smidge` (without dot) for small amount
  else if (!Number.isNaN(amount)) return packValueAndUnit(amount, CoinUnits.Smidge);
  // Show `0 SMH` for zero amount and NaN
  else return packValueAndUnit(0, CoinUnits.SMH);
};

// Returns formatted display string for a smidge amount.
// All coin displayed in the app should display amount formatted
export const formatSmidge = (amount: number, separateResult?: boolean): string | { value: string; unit: string } => {
  const res = getValueAndUnit(amount);
  return separateResult ? { value: res.value, unit: res.unit } : `${res.value} ${res.unit}`;
};

export const constrain = (min: number, max: number, value: number) => Math.min(Math.max(value, min), max);
