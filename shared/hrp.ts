enum HRP {
  MainNet = 'sm',
  TestNet = 'stest',
  Standalone = 'standalone',
}

export const isHRP = (a: any): a is HRP =>
  typeof a === 'string' && (a === HRP.MainNet || a === HRP.TestNet);

export default HRP;
