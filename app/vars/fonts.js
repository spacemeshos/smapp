// @flow
type Font = {
  fontFamily: string,
  fontSize: number,
  fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | string
};

const fontFamilies = {
  openSans: 'sans-serif'
};

const Fonts: { [key: string]: Font } = {
  fontLight24: {
    fontFamily: fontFamilies.openSans,
    fontSize: 24,
    fontWeight: '100'
  },
  fontNormal16: {
    fontFamily: fontFamilies.openSans,
    fontSize: 16,
    fontWeight: 'normal'
  },
  fontNormal14: {
    fontFamily: fontFamilies.openSans,
    fontSize: 14,
    fontWeight: 'normal'
  },
  fontBold14: {
    fontFamily: fontFamilies.openSans,
    fontSize: 14,
    fontWeight: '400'
  },
  fontNormal18: {
    fontFamily: fontFamilies.openSans,
    fontSize: 18,
    fontWeight: 'normal'
  },
  fontLight12: {
    fontFamily: fontFamilies.openSans,
    fontSize: 12,
    fontWeight: '100'
  }
};
export default Fonts;
