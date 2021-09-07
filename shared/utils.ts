// eslint-disable-next-line import/prefer-default-export
export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
