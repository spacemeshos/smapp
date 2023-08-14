// --------------------------------------------------------
// ENV modes
// --------------------------------------------------------

export const isProd = () => process.env.NODE_ENV === 'production';
export const isDev = () => process.env.NODE_ENV === 'development';
export const isDebug = () => isDev() || !!process.env.DEBUG_PROD;

export const isDevNet = (
  proc = process
): proc is NodeJS.Process & {
  env: { NODE_ENV: 'development'; DEV_NET_URL: string };
} => proc.env.NODE_ENV === 'development' && !!proc.env.DEV_NET_URL;
