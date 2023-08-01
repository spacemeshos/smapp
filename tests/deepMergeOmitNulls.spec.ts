import deepMergeOmitNulls from '../shared/deepMergeOmitNulls';

describe('deepMergeOmitNulls(Prev, Next)', () => {
  it('merges objects', () => {
    expect(deepMergeOmitNulls({ a: 1, b: 2, c: 3 }, { a: 5000 })).toEqual({
      a: 5000,
      b: 2,
      c: 3,
    });
  });
  it('merges objects deeply', () => {
    expect(
      deepMergeOmitNulls(
        { a: { b: { c: 3, d: 4 } }, e: 5 },
        { a: { b: { c: 5000 } }, e: 1000 }
      )
    ).toEqual({
      a: { b: { c: 5000, d: 4 } },
      e: 1000,
    });
  });
  it('omit null values (in Next) from Prev', () => {
    expect(
      deepMergeOmitNulls(
        { a: { b: { c: 3, d: 4 } }, e: 5, f: null, g: null },
        { a: { b: { c: null } }, e: null, g: null }
      )
    ).toEqual({
      a: { b: { d: 4 } },
      f: null,
    });
  });
});
