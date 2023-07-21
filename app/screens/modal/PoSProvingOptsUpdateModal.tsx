import React from 'react';
import { useSelector } from 'react-redux';
import PoSProfiler from '../../components/node/PoSProfiler';
import { BITS, RootState } from '../../types';
import { Modal } from '../../components/common';

import ReactPortal from './ReactPortal';

interface Props {
  onUpdate: (nonces: number, threads: number, numUnits?: number) => void;
  onCancel: () => void;
  isLoading: boolean;
}
const PoSProvingOptsUpdateModal = ({
  onUpdate,
  onCancel,
  isLoading,
}: Props) => {
  const postProvingOpts = useSelector(
    (state: RootState) => state.smesher.postProvingOpts
  );
  const numUnits = useSelector((state: RootState) => state.smesher.numUnits);
  const dataDir = useSelector((state: RootState) => state.smesher.dataDir);
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const singleCommitmentSize =
    (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;

  return (
    <ReactPortal modalId="pos-profiler-modal">
      <Modal
        header={'Update PoS proving opts'}
        subHeader={
          "Allow to update PoS proving opts which include nonce's and threads"
        }
        width={750}
        height={530}
      >
        <PoSProfiler
          nextAction={onUpdate}
          numUnitSize={singleCommitmentSize}
          maxUnits={numUnits}
          dataDir={dataDir}
          threads={postProvingOpts.threads}
          nonces={postProvingOpts.nonces}
          footerNextDisabled={isLoading}
          footerNextLabel={isLoading ? ' Updating...' : 'Update'}
          footerSkipLabel={'Close'}
          footerSkipAction={isLoading ? undefined : onCancel}
        />
      </Modal>
    </ReactPortal>
  );
};

export default PoSProvingOptsUpdateModal;
