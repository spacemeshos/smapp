import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { matchPath } from 'react-router-dom';
import { RouteConfig } from '@sentry/react/types/reactrouter';
import routes from './routes';
import { eventsService } from './infra/eventsService';

console.log('desktop/renderer', process.env.SENTRY_DSN, process.env.NODE_ENV);

export const init = () => Sentry.init({
  dsn: process.env.SENTRY_DSN,

  debug: true,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(
        history,
        Object.values(routes).reduce((prev, next) => [...prev, ...next], [] as RouteConfig[]),
        matchPath
      )
    })
  ],
  tracesSampleRate: 1.0,
  maxValueLength: 20000,
  attachStacktrace: true,
  async beforeSend(event, hint) {
    console.log('Before send React');
    const { payload, error } = await eventsService.getNodeAndAppLogs();

    if(error) {
      return event;
    }
    hint.attachments = [
      {
        filename: `log-genesisID-${payload?.genesisID}-eventId-${event?.event_id || 0}.txt`,
        data: payload?.nodeLogs
      },
      {
        filename: `appVersion-${payload?.appLogsFileName}-eventId-${event?.event_id || 0}.txt`,
        data: payload?.appLogs
      }
    ];
    console.log('After send React');
    return event;
  }
});


export const captureReactException = (e: Error) => {
  return Sentry.captureException(e);
};

export const captureReactBreadcrumb = (o: any) => {
  return Sentry.addBreadcrumb(o);
};

export const setReactTags = (tags: any) => {
  return Sentry.setTags(tags);
};

