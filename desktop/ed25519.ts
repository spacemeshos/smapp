import crypto from 'crypto';
import { HexString } from '../shared/types';

export const sign = (dataBytes: Uint8Array, privateKey: HexString) => {
  const key = Buffer.concat([
    Buffer.from('302e020100300506032b657004220420', 'hex'), // DER privateKey prefix for ED25519
    Buffer.from(privateKey, 'hex'),
  ]);
  const pk = crypto.createPrivateKey({
    format: 'der',
    type: 'pkcs8',
    key,
  });
  return Uint8Array.from(crypto.sign(null, dataBytes, pk));
};

export const verify = (
  dataBytes: Uint8Array,
  signatureBytes: HexString | Uint8Array,
  publicKey: HexString
) => {
  const key = Buffer.concat([
    Buffer.from('302a300506032b6570032100', 'hex'), // DER publicKey prefix for ED25519
    Buffer.from(publicKey, 'hex'),
  ]);
  const vk = crypto.createPublicKey({
    format: 'der',
    type: 'spki',
    key,
  });
  const sig =
    typeof signatureBytes === 'string'
      ? Buffer.from(signatureBytes, 'hex')
      : signatureBytes;

  return crypto.verify(null, dataBytes, vk, sig);
};
