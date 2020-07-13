import path from 'path';
import { app } from 'electron';

const logger = require('electron-log');

logger.transports.file.file = path.join(app.getPath('userData'), '/app-logs.txt');

export const writeInfo = (file, fn, res, args) =>
  logger.info(`In ${file}, in ${fn}, received: ${JSON.stringify(res)}${args ? `, called with arguments: ${JSON.stringify(args)}` : ''}`);

export const writeError = (file, fn, err) => logger.error(`In ${file}, in ${fn}, error is: ${err}`);
