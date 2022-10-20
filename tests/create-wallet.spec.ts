import '../desktop/wasm_exec';

import path from 'path';
import fs from 'fs';
import CryptoService from '../desktop/cryptoService';

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
  const pubKey =
    '205d8d4e458b163d5ba15ac712951d5659cc51379e7e0ad13acc97303aa85093';
  const pKey =
    '669d091195f950e6255a2e8778eea7be4f7a66afe855957404ec1520c8a11ff1205d8d4e458b163d5ba15ac712951d5659cc51379e7e0ad13acc97303aa85093';
  const mnemonic =
    'film theme cheese broken kingdom destroy inch ready wear inspire shove pudding';
  it('match keys from mnemonic', () => {
    const result = CryptoService.createWallet(mnemonic);
    expect(result.address).toEqual(pubKey);
    expect(result.secretKey).toEqual(pKey);
    expect(result.publicKey).toEqual(pubKey);
  });

  it('sign message', async () => {
    const message = 'hello world';
    const signature: string = await CryptoService.signMessage({
      message,
      secretKey: pKey,
    });

    expect(signature).toEqual(
      '164c808da28f84bd4939a77e9584e27c111885634ea1e0a2018b7a2ab8dbe19c5b01535691be2c4c198984edfced8d9e7aab4c9300647725629273e2ca8eae01'
    );
  });
});
