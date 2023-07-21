import { WarningObject, WarningType } from '../../../shared/warning';
import { RootState } from '../../types';

export const getWarnings = (state: RootState) => state.ui.warnings;

export const getWarningByType = <T extends WarningType>(type: T) => (
  state: RootState
) =>
  getWarnings(state).find((w) => w.type === type) as
    | WarningObject<T>
    | undefined;
