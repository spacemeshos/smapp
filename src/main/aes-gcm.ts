// Due to documentation we had to import SubtleCrypto
// with dynamical require until we switch to Node version 19+
// then we can replace it with
//   const { subtle } = globalThis.crypto;
const { subtle } = require('crypto').webcrypto;

export const KDF_DKLEN = 256;
export const KDF_ITERATIONS = 120000;

// salt should come from `crypto.randomBytes(16)`
export const pbkdf2Key = async (
  pass: string,
  salt: BufferSource
): Promise<CryptoKey> => {
  const ec = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    ec.encode(pass),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await subtle.deriveKey(
    // Recommended PBKDF2 parameters from OWASP
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#pbkdf2
    {
      name: 'PBKDF2',
      hash: 'SHA-512',
      salt,
      iterations: KDF_ITERATIONS,
    },
    keyMaterial,
    { name: 'AES-GCM', length: KDF_DKLEN },
    true,
    ['encrypt', 'decrypt']
  );
  return key;
};

export const constructAesGcmIv = async (
  key: CryptoKey,
  input: BufferSource
): Promise<ArrayBuffer> => {
  if (key.algorithm.name !== 'AES-GCM') {
    throw new Error('Key is not an AES-GCM key');
  }
  const rawKey = await subtle.exportKey('raw', key);
  const hmacKey = await subtle.importKey(
    'raw',
    rawKey,
    { name: 'HMAC', hash: 'SHA-512' },
    true,
    ['sign']
  );
  const iv = await subtle.sign({ name: 'HMAC' }, hmacKey, input);
  return iv.slice(0, 12); // IV is 12 bytes
};

export const encrypt = async (
  key: CryptoKey,
  iv: BufferSource,
  plaintext: BufferSource
): Promise<ArrayBuffer> => {
  const ciphertext = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    plaintext
  );
  return ciphertext;
};

export const decrypt = async (
  key: CryptoKey,
  iv: BufferSource,
  ciphertext: BufferSource
): Promise<ArrayBuffer> => {
  const plaintext = await subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    ciphertext
  );
  return plaintext;
};
