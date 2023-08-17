export type MnemonicStrengthType = 12 | 24;
export type MnemonicExisting = { existing: string };
export type MnemonicNew = { strength: MnemonicStrengthType };
export type MnemonicOpts = MnemonicExisting | MnemonicNew;
