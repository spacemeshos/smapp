import os from 'os';
import { execFile } from 'child_process';
import pkg from '../package.json';
import { getNodePath } from './main/binaries';

export const getNodeVersion = () =>
  new Promise<string>((resolve, reject) =>
    execFile(getNodePath(), ['version'], (err, stdout) => {
      if (err) return reject(err);
      if (stdout.length === 0)
        return reject(
          new Error('Cannot retrieve a version from go-spacemesh binary')
        );
      const plusSignIndex = stdout.indexOf('+');
      const version =
        plusSignIndex !== -1 ? stdout.slice(0, plusSignIndex) : stdout;
      return resolve(version);
    })
  );

export const getEnvInfo = async () => ({
  smapp: `v${pkg.version}`,
  node: await getNodeVersion(),
  platform: os.platform(),
  arch: os.arch(),
});

export type EnvInfo = ReturnType<typeof getEnvInfo>;
