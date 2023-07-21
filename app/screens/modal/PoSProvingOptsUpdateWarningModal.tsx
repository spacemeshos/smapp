import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PoSProfiler from '../../components/node/PoSProfiler';
import { BITS, RootState } from '../../types';
import { Modal } from '../../components/common';
import {
  pauseSmeshing,
  resumeSmeshing,
  updateProfSettings,
} from '../../redux/smesher/actions';
import { getWarningByType } from '../../redux/ui/selectors';
import { WarningType } from '../../../shared/warning';
import { omitAllWarningsByType } from '../../redux/ui/actions';
import { smColors } from '../../vars';
import ReactPortal from './ReactPortal';

const PoSProvingOptsUpdateWarningModal = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const postProvingOpts = useSelector(
    (state: RootState) => state.smesher.postProvingOpts
  );
  const provingOptsWarning = useSelector(
    getWarningByType(WarningType.UpdateSmeshingProvingOpts)
  );
  const isSmeshing = useSelector(
    (state: RootState) => state.smesher.isSmeshingStarted
  );
  const numUnits = useSelector((state: RootState) => state.smesher.numUnits);
  const dataDir = useSelector((state: RootState) => state.smesher.dataDir);
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const singleCommitmentSize =
    (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;

  if (!provingOptsWarning) {
    return null;
  }

  const updateConfig = async (nonces: number, threads: number) => {
    setLoading(true);

    dispatch(updateProfSettings(nonces, threads));

    if (isSmeshing) {
      await dispatch(pauseSmeshing());
      await dispatch(resumeSmeshing());
    }
    setLoading(false);

    dispatch(omitAllWarningsByType(WarningType.UpdateSmeshingProvingOpts));
  };

  return (
    <ReactPortal modalId="pos-profiler-modal">
      <Modal
        header={'Set PoS proving opts'}
        subHeader={
          'Need to update PoS proving opts settings. They are missing in your config'
        }
        headerColor={smColors.red}
        width={750}
        height={530}
      >
        <PoSProfiler
          nextAction={updateConfig}
          numUnitSize={singleCommitmentSize}
          maxUnits={numUnits}
          dataDir={dataDir}
          threads={postProvingOpts.threads}
          nonces={postProvingOpts.nonces}
          footerNextDisabled={loading}
          footerNextLabel={loading ? 'Setting...' : 'Set'}
        />
      </Modal>
    </ReactPortal>
  );
};

export default PoSProvingOptsUpdateWarningModal;
