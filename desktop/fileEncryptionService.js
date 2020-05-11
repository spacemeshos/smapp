import * as pbkdf2 from 'pbkdf2';
import * as aes from 'aes-js';
import encryptionConst from './encryptionConst';

class FileEncryptionService {
  /**
   * Derives encryption key using provided pin code and salt.
   * @param password - at least 8 digits/chars combo string.
   * @param salt - nonce used for encryption.
   * @return {Uint8Array} derived key.
   * @throws error if password is missing or empty string.
   */
  static createEncryptionKey = ({ password }: { password: string }) => {
    if (!password || !password.length) {
      throw new Error('missing password');
    }
    // Derive a 32 bytes (256 bits) AES sym enc/dec key from the user provided pin
    return pbkdf2.pbkdf2Sync(password, encryptionConst.DEFAULT_SALT, 1000000, 32, 'sha512');
  };

  /**
   * AES encrypt of provided string.
   * @param data - string representation of data to be encrypted.
   * @param key - Buffer used to encrypt data.
   * @return {string} encrypted string.
   * @throws error if one of params is invalid.
   */
  static encryptData = ({ data, key }: { data: string, key: Buffer }) => {
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
   * @param data {string} representation of data to be encrypted.
   * @param key {Uint8Array} used to encrypt data.
   * @return {string} decrypted string.
   * @throws error if one of params is invalid.
   */
  static decryptData = ({ data, key }: { data: string, key: Uint8Array }) => {
    if (!data || !data.length) {
      throw new Error('missing data to decrypt');
    }
    if (!key || !key.length) {
      throw new Error('missing encryption key');
    }
    const aes1Ctr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5)); // eslint-disable-line new-cap
    const tmp = aes.utils.hex.toBytes(data);
    const decryptedBytes = aes1Ctr.decrypt(tmp);
    const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
  };
}

export default FileEncryptionService;
