import CryptoService from '../desktop/cryptoService';
import { sign, verify } from '../desktop/ed25519';
import { toHexString } from '../shared/utils';

describe('create wallet', () => {
  const publicKey =
    'de30fc9b812248583da6259433626fcdd2cb5ce589b00047b81e127950b9bca6';
  const privateKey =
    'cd85df73aa3bc31de2f0b69bb1421df7eb0cdca7cb170a457869ab337749dae1de30fc9b812248583da6259433626fcdd2cb5ce589b00047b81e127950b9bca6';
  const mnemonic =
    'film theme cheese broken kingdom destroy inch ready wear inspire shove pudding';
  it('match keys from mnemonic', () => {
    const result = CryptoService.createWallet(mnemonic);
    expect(result.address).toEqual(publicKey);
    expect(result.secretKey).toEqual(privateKey);
    expect(result.publicKey).toEqual(publicKey);
  });

  it('sign message', async () => {
    const enc = new TextEncoder();
    const message = enc.encode('hello world');
    const signature: string = toHexString(sign(message, privateKey));

    expect(signature).toEqual(
      '2b43bd34d335ad79c8d2268d330111aa0d511b67ba0189fbf94944002fc5ec71264a925def462d2a462e3fc9e3eae53b87173d425244fe142fae06b0af65550c'
    );
    expect(verify(message, signature, publicKey)).toBe(true);

    const anotherSig = toHexString(sign(enc.encode('test'), privateKey));
    expect(anotherSig).not.toEqual(signature);
  });
});
