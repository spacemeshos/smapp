import { generateGenesisID } from '../../desktop/main/Networks';

describe('test Network util functions', () => {
  it('test for generateGenesisID', () => {
    const genesisTime = 'two';
    const extraData = 'one';

    expect(generateGenesisID(genesisTime, extraData)).toEqual(
      generateGenesisID(genesisTime, extraData)
    );
    expect('0x91d338938929ec38e320ba558b6bd8538eae972d').toEqual(
      generateGenesisID(genesisTime, extraData)
    );
  });
});
