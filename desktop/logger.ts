import path from 'path';
import { app } from 'electron';

const logger = require('electron-log');

const formatLogMessage = (className, fn, res, args) =>
  `${className}, in ${fn}, output: ${JSON.stringify(res)} ${
    args ? `; args: ${JSON.stringify(args)}` : ''
  }`;
const formatErrorMessage = (className, fn, err, args) =>
  `${className}, in ${fn}, error: ${JSON.stringify(err)} ${
    args ? `; args: ${JSON.stringify(args)}` : ''
  }`;

logger.transports.file.file = path.join(
  app.getPath('userData'),
  '/app-logs.txt'
);
logger.transports.console.level = false;

const Logger = ({ className }: { className: string }) => ({
  log: (fn: string, res: any, args?: any) => {
    const msg = formatLogMessage(className, fn, res, args);
    logger.info?.(msg);
  },
  error: (fn: string, err: any, args?: any) => {
    const msg = formatErrorMessage(className, fn, err, args);
    logger.error?.(msg);
    // @todo clean up error invokation because of GRPC connection and streams
  },
});

export default Logger;
