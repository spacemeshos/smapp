import { generateGenesisID } from '../../desktop/main/Networks';

describe('test Network util functions', () => {
  const genesisTime = '2022-11-20T20:00:00.498Z';
  const extraData = 'unique-testnet-identifier';

  const expectedGenesisId = 'b92736fb23dfe78efe03c2c45fb638b9fe3afa70';

  it('test for generateGenesisID', () => {
    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      generateGenesisID(genesisTime, extraData)
    );

    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      expectedGenesisId
    );
  });
});
