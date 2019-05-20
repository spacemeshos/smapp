// @flow
import * as bip39 from 'bip39';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

const fromHexString = (hexString: string): Uint8Array => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes: Uint8Array): string => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

class CryptoService {
  constructor() {
    this.loadWASM();
  }

  loadWASM = async () => {
    await this.loadWASMInternal();
  };

  loadWASMInternal = async () => {
    const response = await fetch('../app/infra/cryptoService/ed25519.wasm');
    const bytes = await response.arrayBuffer();
    const go = new Go(); // eslint-disable-line no-undef
    const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
    await go.run(instance);
  };

  stopAndCleanUp = () => __stopAndCleanUp(); // eslint-disable-line no-undef

  generateMnemonic = () => bip39.generateMnemonic();

  /**
   * Generates new master key pair using as seed 12 words mnemonic (128 bits of entropy) as per BIP39.
   * Inside call to function "generateKeyPair" is made - it's exposed from compiled WASM and generates keys following ed25519 protocol
   * @return {{secretKey: Uint8Array[64], publicKey: Uint8Array[32]}}
   */
  generateKeyPair = async ({ mnemonic }: { mnemonic: string }) => {
    // eslint-disable-next-line no-undef
    if (!__generateKeyPair) {
      sleep();
    }
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
    const seed = bip39.mnemonicToSeedHex(mnemonic);
    const seedAsUint8Array = Buffer.from(seed, 'hex');
    let publicKey = new Uint8Array(32);
    let secretKey = new Uint8Array(64);
    const saveKeys = (pk, sk) => {
      if (pk === null || sk === null) {
        this.stopAndCleanUp();
        throw new Error('key generation failed');
      }
      publicKey = pk;
      secretKey = sk;
    };
    __generateKeyPair(seedAsUint8Array, saveKeys); // eslint-disable-line no-undef
    return { publicKey: toHexString(publicKey), secretKey: toHexString(secretKey) };
  };

  /**
   * Signs message to be sent to node.
   * @param secretKey - string
   * @param message - string representing message
   * @return {string} 128 chars string signature
   */
  signTransaction = async ({ message, secretKey }: { message: string, secretKey: string }) => {
    let signature = new Uint8Array(64);
    const enc = new TextEncoder();
    const messageAsByteArray = enc.encode(message);
    const sk = fromHexString(secretKey);
    // eslint-disable-next-line no-undef
    __signTransaction(sk, messageAsByteArray, (sig) => {
      signature = sig;
    });
    return toHexString(signature);
  };

  /**
   * @param mnemonic - string to be validated as mnemonic per BIP39 standard.
   * @return {*|boolean} true if string is a valid mnemonic, false else.
   */
  validateMnemonic = ({ mnemonic }: { mnemonic: string }) => {
    if (!mnemonic || !mnemonic.length) {
      return false;
    }
    return bip39.validateMnemonic(mnemonic);
  };
}

export default new CryptoService();
