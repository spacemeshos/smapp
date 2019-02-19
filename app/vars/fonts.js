// @flow

type Font = {
  fontFamily: string,
  fontSize: number,
  fontWeight:
    | 'bold'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | any
};

const fontFamilies = {
  openSans: 'sans-serif'
};

const Fonts: { [key: string]: Font } = {
  font1: {
    fontFamily: fontFamilies.openSans,
    fontSize: 24,
    fontWeight: '100'
  },
  font2: {
    fontFamily: fontFamilies.openSans,
    fontSize: 16,
    fontWeight: 'normal'
  },
  font3: {
    fontFamily: fontFamilies.openSans,
    fontSize: 14,
    fontWeight: 'normal'
  },
  font4: {
    fontFamily: fontFamilies.openSans,
    fontSize: 14,
    fontWeight: '400'
  },
  font5: {
    fontFamily: fontFamilies.openSans,
    fontSize: 18,
    fontWeight: 'normal'
  },
  font6: {
    fontFamily: fontFamilies.openSans,
    fontSize: 12,
    fontWeight: '100'
  }
};
export default Fonts;
