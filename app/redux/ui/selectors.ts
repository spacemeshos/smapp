import { WarningObject, WarningType } from '../../../shared/warning';
import { RootState } from '../../types';

export const getWarnings = (state: RootState) => state.ui.warnings;

export const getWarningByType = <T extends WarningType>(type: T) => (
  state: RootState
) =>
  getWarnings(state).find((w) => w.type === type) as
    | WarningObject<T>
    | undefined;

export const getOsPlatform = (state: RootState) => state.ui.osPlatform;
export const isWindows = (state: RootState) => {
  const osPlatform = getOsPlatform(state);
  return osPlatform === 'win32';
};

export const isMacOS = (state: RootState) => {
  const osPlatform = getOsPlatform(state);
  return osPlatform === 'darwin';
};

export const isLinux = (state: RootState) => {
  const osPlatform = getOsPlatform(state);
  return osPlatform === 'linux';
};
