import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BITS, RootState } from '../types';
import { captureReactException } from '../sentry';
import { eventsService } from '../infra/eventsService';

export default (onFinishHandler: () => void) => {
  const [loading, setLoading] = useState(false);
  const postProvingOpts = useSelector(
    (state: RootState) => state.smesher.postProvingOpts
  );
  const numUnits = useSelector((state: RootState) => state.smesher.numUnits);
  const dataDir = useSelector((state: RootState) => state.smesher.dataDir);
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const singleCommitmentSize =
    (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;

  const updateConfigHandler = async (nonces: number, threads: number) => {
    setLoading(true);

    try {
      eventsService.updateProvingOpts({
        nonces,
        threads,
      });
    } catch (error: any) {
      captureReactException(error);
      // error handles by ErrorBoundary, we should just finish loading
      setLoading(false);
      return;
    }

    setLoading(false);
    onFinishHandler();
  };

  return {
    updateConfigHandler,
    numUnits,
    dataDir,
    singleCommitmentSize,
    loading,
    nonces: postProvingOpts.nonces,
    threads: postProvingOpts.threads,
  };
};
