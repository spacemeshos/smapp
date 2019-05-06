// @flow
import * as bip39 from 'bip39';
import * as nacl from 'tweetnacl'; // TODO: remove this and replace with "sign" from Go lib

require('./wasm_exec');

// fetch('../app/infra/cryptoService/lib.wasm').then(async (response) => {
//   const bytes = await response.arrayBuffer();
//   // eslint-disable-next-line no-console
//   console.log(WebAssembly.validate(bytes));
//   const go = new Go(); // eslint-disable-line no-undef
//   const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
//   await go.run(instance);
// });

// TODO: make this a normal class

const go = new Go();

let mod, inst;

WebAssembly.instantiateStreaming(fetch('../app/infra/cryptoService/lib.wasm'), go.importObject).then((result) => {
  mod = result.module;
  inst = result.instance;
});

async function run() {
  await go.run(inst);
  inst = await WebAssembly.instantiate(mod, go.importObject); // reset instance
}

run();

/*
  WASM functions API:
  there are 4 functions registered on window object

  "generateKeys"
    <= seed (64 bits Uint8Array)
    => public key (32 bits Uint8Array), secret key (64 bits Uint8Array), hasError (boolean, if true the other values are null)

  "sign2"
    <= secret key (64 bits Uint8Array), message (Uint8Array of any size)
    => signature (64 bits Uint8Array)

  "verify2" - not in use currently

  "shutdown" - no params, shuts down go process. After calling this function "run" function should be called again to restart Go procedure
 */

class KeyGeneratorService {
  static generateMnemonic = () => bip39.generateMnemonic();

  /**
   * Generates new master key pair using as seed 12 words mnemonic (128 bits of entropy) as per BIP39.
   * @return {{secretKey: nacl.SignKeyPair.secretKey, publicKey: nacl.SignKeyPair.publicKey}}
   */
  static generateKeyPair = ({ mnemonic }: { mnemonic: string }) => {
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    const seedAsUint8Array = Buffer.from(seed, 'hex');
    const left32BitsOfSeed = seedAsUint8Array.slice(0, nacl.sign.seedLength); // TODO: remove this and replace with "sign" from Go lib
    const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(left32BitsOfSeed);
    return { publicKey: Buffer.from(publicKey).toString('hex'), secretKey: Buffer.from(secretKey).toString('hex') };
  };

  /**
   * @param mnemonic - string to be validated as mnemonic per BIP39 standard.
   * @return {*|boolean} true if string is a valid mnemonic, false else.
   */
  static validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };
}

export default KeyGeneratorService;
