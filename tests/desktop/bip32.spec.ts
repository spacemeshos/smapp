import { derive_key } from '@spacemesh/ed25519-bip32/node';

describe('ed25519-bip32/derive_key', () => {
  it('deriveKey', () => {
    const seed = new Uint8Array(64).fill(0);
    const seed2 = new Uint8Array(64).fill(1);

    const keypair0 = derive_key(seed, "m/44'/540'/0'/0'/0'");
    const keypair01 = derive_key(seed, "m/44'/540'/0'/0'/0'");
    const keypair2 = derive_key(seed, "m/44'/540'/0'/0'/2'");
    const keypair3 = derive_key(seed2, "m/44'/540'/0'/0'/0'");

    expect(keypair0).toEqual(keypair01);
    expect(keypair0).not.toEqual(keypair2);
    expect(keypair0).not.toEqual(keypair3);
  });
});
