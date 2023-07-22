import React from 'react';
import PoSProfiler from '../../components/node/PoSProfiler';
import { Modal } from '../../components/common';

import useUpdatePostProvingOpts from '../../hooks/useUpdatePostProvingOpts';
import ReactPortal from './ReactPortal';

interface Props {
  closeHandler: () => void;
}
const PoSProvingOptsUpdateModal = ({ closeHandler }: Props) => {
  const {
    updateConfigHandler,
    numUnits,
    dataDir,
    singleCommitmentSize,
    loading,
    nonces,
    threads,
  } = useUpdatePostProvingOpts(closeHandler);

  return (
    <ReactPortal modalId="pos-profiler-modal">
      <Modal
        header={'Update PoS proving opts'}
        subHeader={`This screen allows updating the number of Nonces and CPU threads. 
          These values will be used in the proving process.`}
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
          footerNextLabel={loading ? ' Updating...' : 'Update'}
          footerSkipLabel={'Close'}
          footerSkipAction={loading ? undefined : closeHandler}
        />
      </Modal>
    </ReactPortal>
  );
};

export default PoSProvingOptsUpdateModal;
