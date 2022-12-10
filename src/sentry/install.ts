import os from "os";
// @TODO rewrite only for main process
// import {getOperatingSystemSupportStatus} from "../../.erb/support/os";
import ELECTRON_PROCESS_NAME from "../../.erb/support/electronProcessName";
import {IPCMode} from "@sentry/electron/main";
import config from '../shared/config';

let shouldSendCallback = () => true;

let productionBuildSampleRate = 1;
let tracesSampleRate = 0.005;

const {
  SENTRY_SAMPLE_RATE,
  SENTRY_DSN,
  // SENTRY_LOG_LEVEL,
  NODE_ENV,
  ELECTRON_RELEASE
} = process.env;

if (SENTRY_SAMPLE_RATE) {
  const sampleRate = parseFloat(SENTRY_SAMPLE_RATE);
  productionBuildSampleRate = sampleRate;
  tracesSampleRate = sampleRate;
}

const ignoreErrors = [
  // NETWORK
  "API HTTP",
  "DisconnectedError",
  "EACCES",
  "ECONNABORTED",
  "ECONNREFUSED",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETDOWN",
  "ENETUNREACH",
  "ENOSPC",
  "ENOTFOUND",
  "EPERM",
  "ERR_CONNECTION_RESET",
  "ERR_PROXY_CONNECTION_FAILED",
  "ERR_NAME_NOT_RESOLVED",
  "ERR_INTERNET_DISCONNECTED",
  "ERR_NETWORK_CHANGED",
  "ETIMEDOUT",
  "getaddrinfo",
  "HttpError",
  "Network Error",
  "NetworkDown",
  "NetworkError",
  "NotConnectedError",
  "socket disconnected",
  "socket hang up",
  "ERR_SSL_PROTOCOL_ERROR",
  "status code 404",
  "unable to get local issuer certificate",
];

export function init(Sentry: any, opts: any = {}, sentryInitLib = null) {
  console.log({ SENTRY_DSN })
  // if (!getOperatingSystemSupportStatus().supported) return false;
  if (!SENTRY_DSN) return false;
  console.log('INIT INSTALL')
  Sentry.init({
    dsn: SENTRY_DSN,
    release: ELECTRON_RELEASE,
    environment: NODE_ENV ? "development" : "production",
    debug: NODE_ENV === 'development',
   /* ignoreErrors,
    sampleRate: NODE_ENV === 'development' ? 1 : productionBuildSampleRate,
    tracesSampleRate: NODE_ENV === 'development' ? 1 : tracesSampleRate,
    initialScope: {
      tags: {
        git_commit: 'unrevisioned',
        osType: os.type(),
        osRelease: os.release(),
        process: process?.title || "",
      },
      user: {
        ip_address: null,
      },
    },*/

    beforeSend(data: any, hint: any) {
      if (NODE_ENV === 'development') console.log("before-send", { data, hint });
      // if (!shouldSendCallback()) return null;

      return data;
    },

    /*beforeBreadcrumb(breadcrumb) {
      switch (breadcrumb.category) {
        case "fetch":
        case "xhr": {
          // ignored, too verbose, lot of background http calls
          return null;
        }
      }
      return breadcrumb;
    },*/

    ...opts,
  }, sentryInitLib ? sentryInitLib : {});

  Sentry.withScope(scope => scope.setExtra("process", ELECTRON_PROCESS_NAME));
  return true;
}

export function setShouldSendCallback(f?: () => boolean) {
  shouldSendCallback = f ? f : () => { return false };
}
