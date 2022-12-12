import * as Sentry from '@sentry/electron/main';
import { captureException, setTags, addBreadcrumb } from '@sentry/electron';
import { addAppLogFile, addNodeLogFile } from './utils';
import { Event, EventHint } from '@sentry/types/types/event';

require('dotenv').config();


export const init = () => Sentry.init({
  dsn: process.env.SENTRY_DSN,
  debug: true,
  async beforeSend(event: Event, hint: EventHint) {
    console.log('Before send');
    const attachmentNodeLog = await addNodeLogFile();
    const attachmentAppLog = await addAppLogFile();
    console.log(`${attachmentAppLog.fileName}.txt`);
    hint.attachments = [
      {
        filename: `log-genesisID-${attachmentNodeLog.genesisID}-eventId-${event?.event_id || 0}.txt`,
        data: attachmentNodeLog.content
      },
      {
        filename: `appVersion-${attachmentAppLog.fileName}-eventId-${event?.event_id || 0}.txt`,
        data: attachmentAppLog.content
      }
    ];
    console.log('After send');
    return event;
  }
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