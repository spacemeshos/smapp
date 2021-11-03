import path from 'path';
import { app } from 'electron';

const logger = require('electron-log');

logger.transports.file.file = path.join(app.getPath('userData'), '/app-logs.txt');
logger.transports.console.level = false;

const Logger = ({ className }: { className: string }) => ({
  log: (fn: string, res: any, args?: any) => logger.info(`${className}, in ${fn}, output: ${JSON.stringify(res)} ${args ? `; args: ${JSON.stringify(args)}` : ''}`),
  error: (fn: string, err: any, args?: any) => logger.error(`${className}, in ${fn}, error: ${JSON.stringify(err)} ${args ? `; args: ${JSON.stringify(args)}` : ''}`),
});

export default Logger;
