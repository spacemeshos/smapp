import * as Sentry from '@sentry/electron/main';
import { captureException, setTags, addBreadcrumb } from '@sentry/electron';
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
  const lastLines = await readLinesFromBottom(logFilePath, 4000);
  return {
    genesisID,
    content: lastLines.reverse().join('\n\t'),
  };
};

export const addAppLogFile = async () => {
  const logFilePath = logger.transports.file.getFile().path;

  const lastLines = await readLinesFromBottom(logFilePath, 1000);
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
    debug: true,
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
  return captureException(e);
};

export const captureMainBreadcrumb = (o: any) => {
  return addBreadcrumb(o);
};

export const setMainTags = (tags: any) => {
  return setTags(tags);
};
