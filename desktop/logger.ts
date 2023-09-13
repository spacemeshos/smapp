import path from 'path';
import logger from 'electron-log';
import { isDebug } from './envModes';
import { USERDATA_DIR } from './main/constants';

const formatLogMessage = (className, fn, res, args) =>
  `${className}, in ${fn}, output: ${JSON.stringify(res)} ${
    args ? `; args: ${JSON.stringify(args)}` : ''
  }`;
const formatErrorMessage = (className, fn, err, args) =>
  `${className}, in ${fn}, error: ${JSON.stringify(err)} ${
    args ? `; args: ${JSON.stringify(args)}` : ''
  }`;

logger.transports.file.resolvePath = (vars) =>
  path.join(USERDATA_DIR, `/app-log.${vars.appVersion}.txt`);
logger.transports.file.level = 'debug';
logger.transports.console.level = false;

const Logger = ({ className }: { className: string }) => ({
  log: (fn: string, res: any, args?: any) => {
    const msg = formatLogMessage(className, fn, res, args);
    logger.info?.(msg);
  },
  error: (fn: string, err: any, args?: any) => {
    const msg = formatErrorMessage(className, fn, err, args);
    logger.error?.(msg);
    // @todo clean up error invocation because of GRPC connection and streams and add sentry capture after it
  },
  debug: (title: string, ...args: any[]) => {
    if (!isDebug()) return;
    const payload = args.reduce(
      (acc, next) => `${acc}  ${JSON.stringify(next)}`,
      ''
    );
    const msg = `${title}: ${payload}`;
    logger.debug?.(msg);
  },
});

export default Logger;
