import fs from 'fs/promises';
import * as openpgp from 'openpgp';

const verify = async (filepath: string, sig: Buffer, pubKey: string) => {
  const file = await fs.readFile(filepath, null);
  const publicKey = await openpgp.readKey({ armoredKey: pubKey });
  const message = await openpgp.createMessage({ binary: file });
  const signature = await openpgp.readSignature({
    binarySignature: Uint8Array.from(sig),
  });
  const verified = await openpgp.verify({
    message,
    signature,
    verificationKeys: publicKey,
  });

  return verified.signatures[0].verified;
};

export const verifySignature = async (
  filepath: string,
  sig: Buffer,
  pubKey: string
) => verify(filepath, sig, pubKey).catch(() => false);

export const verifySignatureOnFs = async (
  filepath: string,
  sigpath: string,
  pubKey: string
) => {
  const fileSig = await fs.readFile(sigpath, null);
  return verifySignature(filepath, fileSig, pubKey);
};
