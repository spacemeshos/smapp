import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BITS, RootState } from '../types';
import {
  pauseSmeshing,
  resumeSmeshing,
  updatePostProvingOpts,
} from '../redux/smesher/actions';
import { eventsService } from '../infra/eventsService';

export default (onFinishHandler: () => void) => {
  const dispatch = useDispatch();
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
    dispatch(updatePostProvingOpts(nonces, threads));
    await eventsService.updatePostProvingOpts({ nonces, threads });

    await dispatch(pauseSmeshing());
    await dispatch(resumeSmeshing());

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
