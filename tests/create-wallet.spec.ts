import CryptoService from '../desktop/cryptoService';

// jest.spyOn(global, '__deriveNewKeyPair').mockReturnValue(() => {});

//
// beforeAll(() => {
//   // eslint-disable-next-line no-global-assign
//   global = {
//     // @ts-ignore
//     __deriveNewKeyPair: globalSpy,
//   };
// });
//
// afterAll(() => {
//   // @ts-ignore
//   // eslint-disable-next-line no-global-assign
//   global = {};
// });
//
// function str2ab(buf, len) {
//   const ab = new ArrayBuffer(len);
//   const view = new Uint8Array(ab);
//   for (let i = 0; i < buf.length; ++i) {
//     view[i] = buf[i];
//   }
//   return ab;
// }

beforeAll(() => {
  Object.defineProperty(global, '__deriveNewKeyPair', {
    value: (...props) => {
      const saveKeys = props[3];

      saveKeys(
        [
          106,
          1,
          82,
          73,
          248,
          219,
          15,
          168,
          39,
          27,
          49,
          109,
          173,
          255,
          203,
          95,
          106,
          162,
          47,
          200,
          249,
          249,
          250,
          230,
          178,
          134,
          31,
          87,
          143,
          8,
          64,
          6,
        ],
        [
          197,
          161,
          162,
          134,
          19,
          62,
          180,
          202,
          198,
          46,
          209,
          230,
          177,
          85,
          90,
          67,
          239,
          81,
          250,
          143,
          52,
          137,
          212,
          255,
          126,
          46,
          122,
          43,
          70,
          154,
          213,
          182,
          106,
          1,
          82,
          73,
          248,
          219,
          15,
          168,
          39,
          27,
          49,
          109,
          173,
          255,
          203,
          95,
          106,
          162,
          47,
          200,
          249,
          249,
          250,
          230,
          178,
          134,
          31,
          87,
          143,
          8,
          64,
          6,
        ]
      );
    },
  });
  // @ts-ignore
  /*  jest.spyOn(global, '__deriveNewKeyPair').mockReturnValue(() => ({
    mnemonic:
      'awesome stamp upon penalty humble next rubber rib kit reason feel measure',
    walletPath: "44'/540'/0'/0/0",
    publicKey:
      '308b91c0c430c333497882ba9f16cc94593c1e1225b5b2b1100ee819d811fbf2',
    secretKey:
      '78b028b7b78baec0b0ac810757dc95612ff61c4428469dd8097e34012ba308b5308b91c0c430c333497882ba9f16cc94593c1e1225b5b2b1100ee819d811fbf2',
    address: '308b91c0c430c333497882ba9f16cc94593c1e1225b5b2b1100ee819d811fbf2',
  })); */
});

describe('create wallet', () => {
  const mnemonic =
    'film theme cheese broken kingdom destroy inch ready wear inspire shove pudding';
  it('match keys from mnemonic', () => {
    const result = CryptoService.createWallet(mnemonic);
    const pubKey =
      '6a015249f8db0fa8271b316dadffcb5f6aa22fc8f9f9fae6b2861f578f084006';
    const pKey =
      'c5a1a286133eb4cac62ed1e6b1555a43ef51fa8f3489d4ff7e2e7a2b469ad5b66a015249f8db0fa8271b316dadffcb5f6aa22fc8f9f9fae6b2861f578f084006';
    expect(result.address).toEqual(pubKey);
    expect(result.secretKey).toEqual(pKey);
    expect(result.publicKey).toEqual(pubKey);
  });
});
