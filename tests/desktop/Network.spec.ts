import { generateGenesisID } from '../../desktop/main/Networks';
import { toHexString } from '../../shared/utils';

describe('test Network util functions', () => {
  const genesisTime = '2022-11-20T20:00:00.498Z';
  const extraData = 'unique-testnet-identifier';

  const expectedGenesisId = Uint8Array.from([
    51,
    13,
    17,
    59,
    152,
    12,
    243,
    163,
    29,
    125,
    73,
    182,
    3,
    150,
    80,
    133,
    46,
    74,
    42,
    216,
  ]);

  it('test for generateGenesisID', () => {
    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      generateGenesisID(genesisTime, extraData)
    );

    expect(toHexString(expectedGenesisId)).toEqual(
      generateGenesisID(genesisTime, extraData)
    );
  });
});
