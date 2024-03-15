import { generateGenesisID, convertHashesToMiBs } from '../../shared/utils';

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

describe('convertHashesToMiBs', () => {
  // Test for correct conversion
  it('correctly converts hashes per second to MiBs', () => {
    expect(convertHashesToMiBs(1024 ** 2 / 16)).toBe('1.00'); // 1 MiB
    expect(convertHashesToMiBs(1024 ** 3 / 16)).toBe('1024.00'); // 1 GiB, or 1024 MiBs
    expect(convertHashesToMiBs(1024 ** 5 / 16)).toBe('1073741824.00'); // 1 PiB, or 1024 TiBs
  });

  // Test for edge cases (the speed cannot have the negative value, therefore no need to test for it)
  it('handles zero by returning a formatted string', () => {
    expect(convertHashesToMiBs(0)).toBe('0.00'); // Handling zero
  });
  it('handles non-numeric values by returning a formatted string', () => {
    expect(convertHashesToMiBs(NaN)).toBe('NaN'); // Handling NaN
  });
});
