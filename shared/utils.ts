// eslint-disable-next-line import/prefer-default-export
export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// 'ip:port' -> { ip: string; port: string }
export const parseRemoteApi = (api = '') => {
  const [ip, port] = api.split(':');
  return {
    ip: ip || '',
    port: port || ''
  };
};
