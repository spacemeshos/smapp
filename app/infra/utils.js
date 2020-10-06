const createError = (message, func) => ({
  message,
  retryFunction: func
});

const getAbbreviatedText = (address: string, addPrefix: boolean = true, tailSize: number = 4) =>
  `${addPrefix && address.indexOf('0x') === -1 ? '0x' : ''}${address.substring(0, tailSize)}...${address.substring(address.length - tailSize, address.length)}`;

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
  if (bytes >= 1099511627776) {
    return `${parseFloat((bytes / 1099511627776).toFixed(2))} TB`;
  }
  return `${parseFloat((bytes / 1073741824).toFixed(2))} GB`;
};

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

export { formatSmidge, createError, getAbbreviatedText, getFormattedTimestamp, getAddress, formatBytes };
