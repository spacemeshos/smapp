import * as Sentry from '@sentry/electron/main';
import { Event, EventHint } from '@sentry/types/types/event';
import logger from 'electron-log';
import { generateGenesisIDFromConfig } from './main/Networks';
import { getNodeLogsPath, readLinesFromBottom } from './main/utils';
import NodeConfig from './main/NodeConfig';

require('dotenv').config();

export const addNodeLogFile = async () => {
  const nodeConfig = await NodeConfig.load();
  const genesisID = generateGenesisIDFromConfig(nodeConfig);
  const logFilePath = getNodeLogsPath(generateGenesisIDFromConfig(nodeConfig));
  // Otherwise if Node exited, but there are no critical errors
  // in the pool — search for fatal error in the logs
  const lastLines = await readLinesFromBottom(logFilePath, 20000);
  return {
    genesisID,
    content: lastLines.reverse().join('\n\t'),
  };
};

export const addAppLogFile = async () => {
  const logFilePath = logger.transports.file.getFile().path;

  const lastLines = await readLinesFromBottom(logFilePath, 5000);
  const appStartFrom = logFilePath.indexOf('app-log');
  const fileName = logFilePath.slice(
    appStartFrom > 0 ? appStartFrom : 0,
    logFilePath.length - 4
  );
  return {
    fileName,
    content: lastLines.reverse().join('\n\t'),
  };
};

export const init = () =>
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
    tracesSampleRate: parseInt(process.env.TRACES_SAMPLE_RATE || '0.3'),
    debug: process.env.SENTRY_LOG_LEVEL === 'debug',
    enabled: false,
    maxValueLength: 25000,
    attachStacktrace: true,
    attachScreenshot: true,
    async beforeSend(event: Event, hint: EventHint) {
      const attachmentNodeLog = await addNodeLogFile();
      const attachmentAppLog = await addAppLogFile();
      hint.attachments = [
        {
          filename: `log-genesisID-${attachmentNodeLog.genesisID}-eventId-${
            event?.event_id || 0
          }.txt`,
          data: attachmentNodeLog.content,
        },
        {
          filename: `appVersion-${attachmentAppLog.fileName}-eventId-${
            event?.event_id || 0
          }.txt`,
          data: attachmentAppLog.content,
        },
      ];
      return event;
    },
  });

export const captureMainException = (e: Error) => {
  return Sentry.captureException(e);
};

export const captureMainBreadcrumb = (o: any) => {
  return Sentry.addBreadcrumb(o);
};

export const setMainTags = (tags: any) => {
  return Sentry.setTags(tags);
};
