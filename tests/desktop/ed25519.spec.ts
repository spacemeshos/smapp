/* eslint-disable prettier/prettier */

import * as sm from '@spacemesh/sm-codec';
import * as ed from '../../desktop/ed25519';

describe('ed25519', () => {
  const publicKey =
    'd3a11c7b10ea55551210952219314b3ab3eae3c571e1274736cda24bb2bd0f7f';
  const secretKey =
    '78cf687d957abba7d555c2e0974e1c83c34e8c4bc491b3d034216fdf9a78c94dd3a11c7b10ea55551210952219314b3ab3eae3c571e1274736cda24bb2bd0f7f';
  const genesisID = new Uint8Array([
    51, 13, 17, 59, 152, 12, 243, 163, 29, 125, 73, 182, 3, 150, 80, 133, 46, 74, 42, 216
  ]);
  const tx = Uint8Array.from([
    0, 0, 0, 0, 0, 136, 115, 101, 220, 126, 211, 50, 161, 69, 251, 61, 50, 57,
    9, 205, 103, 53, 34, 165, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 211, 161, 28, 123, 16, 234, 85, 85,
    18, 16, 149, 34, 25, 49, 75, 58, 179, 234, 227, 197, 113, 225, 39, 71, 54,
    205, 162, 75, 178, 189, 15, 127,
  ]);
  const sigExpected = Uint8Array.from([
    128, 32, 217, 2, 158, 45, 161, 255, 67, 18, 39,
    21, 53, 249, 18, 247, 13, 7, 165, 174, 228, 181,
    180, 11, 78, 168, 143, 91, 133, 131, 219, 87, 165,
    117, 29, 165, 194, 254, 26, 125, 8, 177, 2, 166,
    201, 228, 11, 173, 90, 204, 176, 128, 188, 73, 242,
    96, 71, 228, 47, 64, 74, 74, 133, 6,
  ]);
  it('sign', () => {
    const hash = sm.hash(new Uint8Array([...genesisID, ...tx]));
    const sig = ed.sign(hash, secretKey);
    expect(sig).toEqual(sigExpected);
  });
  it('verify', () => {
    const hash = sm.hash(new Uint8Array([...genesisID, ...tx]));
    const res = ed.verify(hash, sigExpected, publicKey);
    expect(res).toBeTruthy();
  });
});
