import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PoSProfiler from '../../components/node/PoSProfiler';
import { Modal } from '../../components/common';
import { getWarningByType } from '../../redux/ui/selectors';
import { WarningType } from '../../../shared/warning';
import { omitWarning } from '../../redux/ui/actions';
import { smColors } from '../../vars';
import useUpdatePostProvingOpts from '../../hooks/useUpdatePostProvingOpts';
import ReactPortal from './ReactPortal';

const PoSProvingOptsUpdateWarningModal = () => {
  const dispatch = useDispatch();
  const provingOptsWarning = useSelector(
    getWarningByType(WarningType.UpdateSmeshingProvingOpts)
  );
  const {
    updateConfigHandler,
    numUnits,
    dataDir,
    singleCommitmentSize,
    loading,
    nonces,
    threads,
  } = useUpdatePostProvingOpts(
    () => provingOptsWarning && dispatch(omitWarning(provingOptsWarning))
  );

  if (!provingOptsWarning) {
    return null;
  }

  return (
    <ReactPortal modalId="pos-profiler-modal">
      <Modal
        header={'Set PoS proving opts'}
        subHeader={
          'Please update the PoS proving opts. They are missing in your config.'
        }
        headerColor={smColors.red}
        width={750}
        height={530}
      >
        <PoSProfiler
          nextAction={updateConfigHandler}
          numUnitSize={singleCommitmentSize}
          maxUnits={numUnits}
          dataDir={dataDir}
          threads={threads}
          nonces={nonces}
          footerNextDisabled={loading}
          footerNextLabel={loading ? 'Setting...' : 'Set'}
        />
      </Modal>
    </ReactPortal>
  );
};

export default PoSProvingOptsUpdateWarningModal;
