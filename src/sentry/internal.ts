import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import { init, setShouldSendCallback } from "./install";

const available = init(Sentry, {
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
});

if (available) {
  Sentry
}

export default (shouldSendCallback?: () => boolean ) => {
  if (!available) return;
  setShouldSendCallback(shouldSendCallback);
};

export const captureException = (e: Error) => {
  return Sentry.captureException(e);
};

export const captureBreadcrumb = (o: any) => {
  Sentry.addBreadcrumb(o);
};

export const setTags = (tags: any) => {
  Sentry.setTags(tags);
};

export const getSentryIfAvailable = (): typeof Sentry | null => {
  return available ? Sentry : null;
};
