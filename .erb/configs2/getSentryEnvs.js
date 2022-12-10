export default () =>
  !process.env.SENTRY_AUTH_TOKEN ? {} : {
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENV: process.env.SENTRY_ENV || process.env.NODE_ENV,
  };
