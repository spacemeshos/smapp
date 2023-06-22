const getFeeAmount = (maxGas: number, fee: number) =>
  maxGas === 0 ? '(??? Smidge)' : `(${fee * maxGas} Smidge)`;

const getFees = (maxGas: number) => [
  {
    fee: 1,
    label: `1x ${getFeeAmount(maxGas, 1)}`,
  },
  {
    fee: 2,
    label: `2x ${getFeeAmount(maxGas, 2)}`,
  },
  {
    fee: 3,
    label: `3x ${getFeeAmount(maxGas, 3)}`,
  },
];

export default getFees;
