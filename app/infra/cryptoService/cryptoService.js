import * as bip39 from 'bip39';
import * as xdr from 'js-xdr';
import { fromHexString, toHexString } from '/infra/utils';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

class CryptoService {
  stopAndCleanUp = () => __stopAndCleanUp(); // eslint-disable-line no-undef

  generateMnemonic = () => bip39.generateMnemonic();

  /**
   * Generates new master key pair using as seed 12 words mnemonic (128 bits of entropy) as per BIP39.
   * Inside call to function "generateKeyPair" is made - it's exposed from compiled WASM and generates keys following ed25519 protocol
   * @return {{secretKey: Uint8Array[64], publicKey: Uint8Array[32]}}
   */
  generateKeyPair = ({ mnemonic }: { mnemonic: string }) => {
    // eslint-disable-next-line no-undef
    if (!__generateKeyPair) {
      sleep();
    }
    // Generate 64 seed bytes (512 bits) from phrase - this is a wallet's master seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);
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
    __generateKeyPair(seed, saveKeys); // eslint-disable-line no-undef
    return { publicKey: toHexString(publicKey), secretKey: toHexString(secretKey) };
  };

  /**
   *
   * @param mnemonic {string}
   * @param index {integer}
   * @param salt {string}
   * @return {{secretKey: Uint8Array[64], publicKey: Uint8Array[32]}}
   */
  deriveNewKeyPair = ({ mnemonic, index, salt }: { mnemonic: string }) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    let publicKey = new Uint8Array(32);
    let secretKey = new Uint8Array(64);
    const enc = new TextEncoder();
    const saltAsUint8Array = enc.encode(salt);
    const saveKeys = (pk, sk) => {
      if (pk === null || sk === null) {
        this.stopAndCleanUp();
        throw new Error('key generation failed');
      }
      publicKey = pk;
      secretKey = sk;
    };
    __deriveNewKeyPair(seed.slice(32), index, saltAsUint8Array, saveKeys); // eslint-disable-line no-undef
    return { publicKey: toHexString(publicKey), secretKey: toHexString(secretKey) };
  };

  /**
   * Signs message to be sent to node.
   * @param secretKey - string
   * @param accountNonce - account's next nonce value
   * @param recipient - recipient's address
   * @param price - fee in SMC cents
   * @param amount - amount to transfer in SMC cents
   * @return {Promise} when resolved returns signature as Uint8Array(64)
   */
  signTransaction = ({ accountNonce, recipient, price, amount, secretKey }: { accountNonce: number, recipient: string, price: number, amount: number, secretKey: string }) => {
    const sk = fromHexString(secretKey);
    const types = xdr.config((xdr1) => {
      xdr1.struct('InnerSerializableSignedTransaction', [
        ['AccountNonce', xdr1.uhyper()],
        ['Recipient', xdr1.opaque(32)],
        ['GasLimit', xdr1.uhyper()],
        ['Price', xdr1.uhyper()],
        ['Amount', xdr1.uhyper()]
      ]);
      xdr1.struct('SerializableSignedTransaction', [['InnerSerializableSignedTransaction', xdr1.lookup('InnerSerializableSignedTransaction')], ['Signature', xdr1.opaque(64)]]);
    });
    const message = new types.InnerSerializableSignedTransaction({
      AccountNonce: xdr.UnsignedHyper.fromString(accountNonce),
      Recipient: Buffer.from(fromHexString(recipient)),
      GasLimit: xdr.UnsignedHyper.fromString('5'), // TODO: change to real number passed from user selection
      Price: xdr.UnsignedHyper.fromString(`${price}`),
      Amount: xdr.UnsignedHyper.fromString(`${amount}`)
    });
    const bufMessage = message.toXDR();
    return new Promise((resolve) => {
      const bufMessageAsUint8Array = new Uint8Array(bufMessage);
      // eslint-disable-next-line no-undef
      __signTransaction(sk, bufMessageAsUint8Array, (sig) => {
        const tx = new types.SerializableSignedTransaction({
          InnerSerializableSignedTransaction: message,
          Signature: sig
        });
        resolve(tx.toXDR());
      });
    });
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
