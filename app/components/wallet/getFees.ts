const getFeeAmount = (maxGas: number, fee: number) =>
  maxGas === 0 ? '(??? Smidge)' : `(~${fee * maxGas} Smidge)`;

const getFees = (maxGas: number) => [
  {
    fee: 1,
    label: `~10 min ${getFeeAmount(maxGas, 1)}`,
  },
  {
    fee: 2,
    label: `~5 min ${getFeeAmount(maxGas, 2)}`,
  },
  {
    fee: 3,
    label: `~1 min ${getFeeAmount(maxGas, 3)}`,
  },
];

export default getFees;
