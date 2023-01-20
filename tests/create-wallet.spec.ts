import '../desktop/wasm_exec';

import path from 'path';
import fs from 'fs';
import CryptoService from '../desktop/cryptoService';
import { sign, verify } from '../desktop/ed25519';
import { toHexString } from '../shared/utils';

beforeAll(async () => {
  const bytes = fs.readFileSync(
    path.resolve(__dirname, '../desktop', 'ed25519.wasm')
  );
  // @ts-ignore
  const go = new Go(); // eslint-disable-line no-undef
  const { instance } = await WebAssembly.instantiate(bytes, go.importObject);

  go.run(instance);
});

describe('create wallet', () => {
  const publicKey =
    '205d8d4e458b163d5ba15ac712951d5659cc51379e7e0ad13acc97303aa85093';
  const privateKey =
    '669d091195f950e6255a2e8778eea7be4f7a66afe855957404ec1520c8a11ff1205d8d4e458b163d5ba15ac712951d5659cc51379e7e0ad13acc97303aa85093';
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
      '164c808da28f84bd4939a77e9584e27c111885634ea1e0a2018b7a2ab8dbe19c14f227eba1dee2532b2be78fade6167c4484511819950ab26e674cd4cf4a0c0f'
    );
    expect(verify(message, signature, publicKey)).toBe(true);

    const anotherSig = toHexString(sign(enc.encode('test'), privateKey));
    expect(anotherSig).not.toEqual(signature);
  });
});
