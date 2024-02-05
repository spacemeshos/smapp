import os from 'os';
import path from 'path';
import { app } from 'electron';

const BINARY_OS_TARGETS = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows',
};

export const getBinaryPath = () =>
  path.resolve(
    app.getAppPath(),
    process.env.NODE_ENV === 'development'
      ? `../node/${BINARY_OS_TARGETS[os.type()]}/`
      : '../../node/'
  );

export const getBinaryExt = () => (os.type() === 'Windows_NT' ? '.exe' : '');

export const getQuicksyncPath = () =>
  path.resolve(getBinaryPath(), `quicksync${getBinaryExt()}`);

export const getNodePath = () =>
  path.resolve(getBinaryPath(), `go-spacemesh${getBinaryExt()}`);

export const getProfilerPath = () =>
  path.resolve(getBinaryPath(), `profiler${getBinaryExt()}`);
