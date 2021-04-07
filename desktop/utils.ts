export const fromHexString = (hexString: string) => {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    // @ts-ignore
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};

export const toHexString = (bytes: Uint8Array) => bytes.reduce((str: string, byte: number) => str + byte.toString(16).padStart(2, '0'), '');
