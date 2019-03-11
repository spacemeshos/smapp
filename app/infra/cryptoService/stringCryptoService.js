// @flow
import * as pbkdf2 from 'pbkdf2';
import * as aes from 'aes-js';

class StringCryptoService {
  /**
   * Derives encryption key using provided pin code and salt.
   * @param pinCode - at least 8 digits/chars combo string.
   * @param salt - nonce used for encryption.
   * @param callBack - callback for async key derivation func.
   * @return {{string, string}} derived key.
   * @throws error if pin code missing or empty string.
   */
  static createEncryptionKey = ({ pinCode, salt }: { pinCode: string, salt: string }) => {
    if (!pinCode || !pinCode.length) {
      throw new Error('missing pin code');
    }
    // Derive a 32 bytes (256 bits) AES sym enc/dec key from the user provided pin
    const key = pbkdf2.pbkdf2Sync(pinCode, salt, 1000000, 32, 'sha512');
    return key.toString('hex');
  };

  /**
   * AES encrypt of provided string.
   * @param data - string representation of data to be encrypted.
   * @param key - string used to encrypt data.
   * @return {string} encrypted string.
   * @throws error if one of params is invalid.
   */
  static encryptData = ({ data, key }: { data: string, key: string }) => {
    if (!data || !data.length) {
      throw new Error('missing data to encrypt');
    }
    if (!key || !key.length) {
      throw new Error('missing encryption key');
    }
    const textBytes = aes.utils.utf8.toBytes(data);
    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5)); // eslint-disable-line new-cap
    const encryptedBytes = aesCtr.encrypt(textBytes);
    const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  };

  /**
   * AES decrypt of provided string.
   * @param data - string representation of data to be encrypted.
   * @param key - string used to encrypt data.
   * @return {string} decrypted string.
   * @throws error if one of params is invalid.
   */
  static decryptData = ({ data, key }: { data: string, key: string }) => {
    if (!data || !data.length) {
      throw new Error('missing data to decrypt');
    }
    if (!key || !key.length) {
      throw new Error('missing encryption key');
    }
    const textBytes = aes.utils.utf8.toBytes(data);
    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5)); // eslint-disable-line new-cap
    const decryptedBytes = aesCtr.decrypt(textBytes);
    const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
  };
}

export default StringCryptoService;
