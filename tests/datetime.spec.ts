import {
  formatAsDate,
  formatDateAsISO,
  formatDateAsUS,
  formatISOAsUS,
  parseISODate,
} from '../shared/datetime';

describe('datetime utils', () => {
  const genesis = new Date(0);
  const btcGenesis = new Date('03 Jan 2009 18:15:00 GMT');

  it('formats date as kinda ISO format', () => {
    expect(formatDateAsISO(genesis)).toEqual('1970-01-01T00-00-00.000Z');
    expect(formatDateAsISO(btcGenesis)).toEqual('2009-01-03T18-15-00.000Z');
  });

  it('formats date in human readable format', () => {
    expect(formatDateAsUS(genesis)).toEqual(
      'Thursday, January 1, 1970 at 00:00'
    );
    expect(formatDateAsUS(btcGenesis)).toEqual(
      'Saturday, January 3, 2009 at 18:15'
    );
  });

  it('converts ISO to US', () => {
    expect(formatISOAsUS('1970-01-01T00-00-00.000Z')).toEqual(
      'Thursday, January 1, 1970 at 00:00'
    );
    expect(formatISOAsUS('2009-01-03T18-15-00.000Z')).toEqual(
      'Saturday, January 3, 2009 at 18:15'
    );
  });

  it('formatISOAsYearMonthDay', () => {
    expect(formatAsDate(new Date('2023-11-28T12:00:00.000Z'))).toEqual(
      'November 28, 2023'
    );
  });

  it('parseISODate', () => {
    expect(parseISODate('2023-11-28T12:00:00.000Z')).toEqual(
      new Date('2023-11-28T12:00:00.000Z')
    );
  });
});
