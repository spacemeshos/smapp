import * as dotenv from 'dotenv'

interface Config {
  SENTRY_DSN: string;
  SENTRY_AUTH_TOKEN: string;
  NODE_ENV: string;
  SENTRY_LOG_LEVEL: string;
  ANALYZE: string;
  ELECTRON_RELEASE?: string;
  SENTRY_SAMPLE_RATE: string;
}

const config = dotenv.config().parsed as unknown as Config
export default config;
