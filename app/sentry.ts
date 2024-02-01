import {
  init as initSentry,
  captureMessage,
  addBreadcrumb,
  setTags,
  captureException,
  captureUserFeedback,
  reactRouterV5Instrumentation,
} from '@sentry/react';
import { BrowserTracing } from '@sentry/browser';
import { matchPath } from 'react-router-dom';
import { RouteConfig } from '@sentry/react/types/reactrouter';
import { Primitive } from '@sentry/types';
import routes from './routes';
import { eventsService } from './infra/eventsService';

export const init = (history) =>
  initSentry({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
    enabled: true,
    debug: process.env.SENTRY_LOG_LEVEL === 'debug',
    attachStacktrace: true,
    maxValueLength: 25000,
    tracesSampleRate: parseFloat(process.env.TRACES_SAMPLE_RATE || '1.0'),
    integrations: [
      new BrowserTracing({
        routingInstrumentation: reactRouterV5Instrumentation(
          history,
          Object.values(routes).reduce(
            (prev, next) => [...prev, ...next],
            [] as RouteConfig[]
          ),
          matchPath
        ),
      }),
    ],
    async beforeSend(event, hint) {
      const isFeedbackFormMessage = (event?.message || '').includes(
        'User Reported: '
      );

      if (!isFeedbackFormMessage) {
        return event;
      }

      const { payload, error } = await eventsService.getNodeAndAppLogs();

      if (error) {
        return event;
      }

      // add attachments only for User Feedback
      hint.attachments = [
        {
          filename: `log-genesisID-${payload?.genesisID}-eventId-${
            event?.event_id || 0
          }.txt`,
          data: payload?.nodeLogs,
        },
        {
          filename: `appVersion-${payload?.appLogsFileName}-eventId-${
            event?.event_id || 0
          }.txt`,
          data: payload?.appLogs,
        },
      ];

      // clean up stack trace for User Feedback do not clutter the report in the Sentry
      if (event.exception?.values) {
        event.exception.values = [];
      }

      return event;
    },
  });

export const captureReactException = (e: Error) => captureException(e);
export const captureReactMessage = (message: string) => captureMessage(message);
export const captureReactBreadcrumb = (o: any) => addBreadcrumb(o);
export const setReactTags = (tags: { [key: string]: Primitive }) =>
  setTags(tags);
export const captureReactUserFeedback = (formData: any) =>
  captureUserFeedback(formData);
