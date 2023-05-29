import { resolve } from 'path';
import {
  verifySignature,
  verifySignatureOnFs,
} from '../../desktop/verifyFileSignature';

const fixture = (filename: string) =>
  resolve(__dirname, '../fixtures/', filename);

describe('GPG signature verification', () => {
  const pubKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZFWoBRYJKwYBBAHaRw8BAQdAqUMGPwHBx79NZdMv0+kt1317XQ1HsKFXu67V
2+pJs8a0JUtpcmlsbCBTaHVtaWxvdiA8a2lyaWxsQHNwYWNlbWVzaC5pbz6ImQQT
FgoAQRYhBOaqIJkTwvYZxDiVf2AzZlD2JLgDBQJkVagFAhsDBQkDwmcABQsJCAcC
AiICBhUKCQgLAgQWAgMBAh4HAheAAAoJEGAzZlD2JLgDXncBAJK2vtehOkr7QOpg
la310gKSGafJJUtfYWABz680fM7EAP4uCLX3NBLdrT/US9twhbh+Igy27Lk4YlhR
IN4uoEB1B7g4BGRVqAUSCisGAQQBl1UBBQEBB0Bd94Xf7kt/+BLZqgh/5ogeAYjn
W6zoAFm71dAK7qdwJwMBCAeIfgQYFgoAJhYhBOaqIJkTwvYZxDiVf2AzZlD2JLgD
BQJkVagFAhsMBQkDwmcAAAoJEGAzZlD2JLgDn48A/Ru67P51fTwKZTHl+g4eUuZ/
oDLlWkoCXRLmLyG7FZaLAQCsfMsxjB2dstLqmgDWNm+0IOb6IXFp3X5gYssQuFFg
CQ==
=ioXG
-----END PGP PUBLIC KEY BLOCK-----`;

  const signature = Buffer.from(
    '88750400160a001d162104e6aa209913c2f619c438957f60336650f624b80305026456cc6a000a091060336650f624b8030ea001008704ed22d071bbb3e5ad32f72eee7883117a2e6d243f539b9ba6617795ddbb2b00fc0f9212e12e845cf7f800dc19f3338d5431bb954404b0dd7b54851c1dab464d07',
    'hex'
  );

  describe('verifySignature', () => {
    it('returns Promise<true> if vlaid', async () => {
      const res = await verifySignature(
        fixture('verifyFileSignature.txt'),
        signature,
        pubKey
      );
      expect(res).toBe(true);
    });
    it('returns Promise<false> if invlaid', async () => {
      const res = await verifySignature(
        fixture('verifyFileSignature.txt'),
        Buffer.from([0, 1, 2, 3, 4, 5]),
        pubKey
      );
      expect(res).toBe(false);
    });
  });
  describe('verifySignatureOnFs', () => {
    it('returns Promise<true> if valid', async () => {
      const res = await verifySignatureOnFs(
        fixture('verifyFileSignature.txt'),
        fixture('verifyFileSignature.txt.sig'),
        pubKey
      );
      expect(res).toBe(true);
    });
    it('returns Promise<false> if invalid', async () => {
      const res = await verifySignatureOnFs(
        fixture('verifyFileSignature.txt.sig'),
        fixture('verifyFileSignature.txt.sig'),
        pubKey
      );
      expect(res).toBe(false);
    });
  });
});
