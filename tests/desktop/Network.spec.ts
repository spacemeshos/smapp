import { generateGenesisID } from '../../desktop/main/Networks';

describe('test Network util functions', () => {
  const genesisTime = '2022-11-20T20:00:00.498Z';
  const extraData = 'unique-testnet-identifier';

  const expectedGenesisId = 'd8396c06f55f14d651e0a1846eb5c13dba909a4d';

  it('test for generateGenesisID', () => {
    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      generateGenesisID(genesisTime, extraData)
    );

    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      expectedGenesisId
    );
  });
});
