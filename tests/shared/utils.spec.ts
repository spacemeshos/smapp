import { generateGenesisID } from '../../shared/utils';

describe('generateGenesisID', () => {
  const genesisTime = '2022-11-20T20:00:00.498Z';
  const extraData = 'unique-testnet-identifier';

  it('is pure & determenistic', () => {
    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      generateGenesisID(genesisTime, extraData)
    );
  });
  it('works as expected', () => {
    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      'b92736fb23dfe78efe03c2c45fb638b9fe3afa70'
    );
  });
});
