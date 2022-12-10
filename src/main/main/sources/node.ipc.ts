import { ipcConsts } from '../../../renderer/vars';
import { fromIPC } from '../rx.utils';

const nodeIPCStreams = () => ({
  $nodeRestartRequest: fromIPC<void>(ipcConsts.N_M_RESTART_NODE),
});

export default nodeIPCStreams;
