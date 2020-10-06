import path from 'path';
import { app } from 'electron';

const logger = require('electron-log');

logger.transports.file.file = path.join(app.getPath('userData'), '/app-logs.txt');
logger.transports.console.level = false;

export const Logger = ({ className }) => ({
  log: (fn, res, args) => logger.info(`${className}, in ${fn}, output: ${JSON.stringify(res)} ${args ? `; args: ${JSON.stringify(args)}` : ''}`),
  error: (fn, err, args) => logger.error(`${className}, in ${fn}, error: ${JSON.stringify(err)} ${args ? `; args: ${JSON.stringify(args)}` : ''}`)
});

export const writeInfo = (file, fn, res, args) =>
  logger.info(`In ${file}, in ${fn}, received: ${JSON.stringify(res)}${args ? `, called with arguments: ${JSON.stringify(args)}` : ''}`);

export const writeError = (file, fn, err) => logger.error(`In ${file}, in ${fn}, error is: ${err}`);
