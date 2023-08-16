import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BITS, RootState } from '../types';
import { updateProvingOptsAndRestartSmeshing } from '../redux/smesher/actions';
import { captureReactException } from '../sentry';

export default (onFinishHandler: () => void) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const postProvingOpts = useSelector(
    (state: RootState) => state.smesher.postProvingOpts
  );
  const postSetupState = useSelector(
    (state: RootState) => state.smesher.postSetupState
  );
  const numUnits = useSelector((state: RootState) => state.smesher.numUnits);
  const dataDir = useSelector((state: RootState) => state.smesher.dataDir);
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const singleCommitmentSize =
    (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;

  const updateConfigHandler = async (nonces: number, threads: number) => {
    setLoading(true);

    try {
      await dispatch(
        updateProvingOptsAndRestartSmeshing(nonces, threads, postSetupState)
      );
    } catch (error: any) {
      captureReactException(error);
      // error handles by ErrorBoundary, here we should just finish loading
      setLoading(false);
      throw error;
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
