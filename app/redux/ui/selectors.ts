import { WarningObject, WarningType } from '../../../shared/warning';
import { RootState } from '../../types';

export const getWarnings = (state: RootState) => state.ui.warnings;

export const getWarningByType = (type: WarningType) => (state: RootState) =>
  getWarnings(state).find((w) => w.type === type) as
    | WarningObject<WarningType.WriteFilePermission>
    | undefined;
