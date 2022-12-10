import * as Sentry from "@sentry/electron/renderer";
import { init as reactInit } from '@sentry/react';
import { BrowserTracing } from "@sentry/tracing";
import { init, setShouldSendCallback } from "./install";

const available = init(Sentry, {
  integrations: [new BrowserTracing()]
// @ts-ignore
}, reactInit);

export default async (shouldSendCallback?: () => boolean) => {
  if (!available) return;
  setShouldSendCallback(shouldSendCallback);
};

export const captureException = (e: Error) => {
  return Sentry.captureException(e);
};

export const captureBreadcrumb = (o: any) => {
  return Sentry.addBreadcrumb(o);
};

export const setTags = (tags: any) => {
  return Sentry.setTags(tags);
};

export const getSentryIfAvailable = (): typeof Sentry | null => {
  return available ? Sentry : null;
};
