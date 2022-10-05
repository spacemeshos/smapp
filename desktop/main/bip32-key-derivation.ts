/* eslint-disable no-bitwise, no-plusplus */

import { algo, enc } from 'crypto-js';

const ED25519_CURVE = 'ed25519 seed';
const HARDENED_OFFSET = 0x80000000;

export default class Bip32KeyDerivation {
  static derivePath = (path: string, seed: string): Chain => {
    const { key, chainCode } = Bip32KeyDerivation.getKeyFromSeed(seed);
    const segments = path
      .split('/')
      .map((v) => v.replaceAll("'", ''))
      .map((el) => parseInt(el, 10));
    return segments.reduce(
      (parentKeys, segment) =>
        // @ts-ignore
        Bip32KeyDerivation.CKDPriv(parentKeys, segment + HARDENED_OFFSET),
      { key, chainCode }
    );
  };

  private static getKeyFromSeed = (seed: string): Chain => {
    return Bip32KeyDerivation.derive(
      enc.Hex.parse(seed),
      enc.Utf8.parse(ED25519_CURVE)
    );
  };

  private static CKDPriv = ({ key, chainCode }: Chain, index: number) => {
    const ib: number[] = [];
    ib.push((index >> 24) & 0xff);
    ib.push((index >> 16) & 0xff);
    ib.push((index >> 8) & 0xff);
    ib.push(index & 0xff);
    const data = `00${key}${Buffer.from(new Uint8Array(ib).buffer).toString(
      'hex'
    )}`;
    return Bip32KeyDerivation.derive(
      enc.Hex.parse(data),
      enc.Hex.parse(chainCode)
    );
  };

  private static derive = (data: string, base: string): Chain => {
    // @ts-ignore
    const hmac = algo.HMAC.create(algo.SHA512, base);
    const I = hmac.update(data).finalize().toString();
    const IL = I.slice(0, I.length / 2);
    const IR = I.slice(I.length / 2);

    return {
      key: IL,
      chainCode: IR,
    };
  };
}

export interface Chain {
  key: string;
  chainCode: string;
}
