import * as Sentry from "@sentry/electron/main";
import "@sentry/tracing";
import { init, setShouldSendCallback } from "./install";

const available = init(Sentry);

export default (shouldSendCallback?: () => boolean) => {
  if (!available) return;
  setShouldSendCallback(shouldSendCallback);
  // Sentry.setUser({ id: userId, ip_address: null });
};

export const captureException = (e: Error) => {
  return Sentry.captureEvent(e);
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
