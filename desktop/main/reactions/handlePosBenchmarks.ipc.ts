import { Observable, withLatestFrom } from 'rxjs';
import { BrowserWindow } from 'electron';
import { fromIPC } from '../rx.utils';
import {
  BenchmarkRequest,
  BenchmarkResponse,
  NodeConfig,
} from '../../../shared/types';
import { ipcConsts } from '../../../app/vars';
import { BenchmarkRunResult, runBenchmarks } from '../../posProfiler';

const convert = (r: BenchmarkRunResult): BenchmarkResponse => ({
  nonces: r.inputs.nonces,
  threads: r.inputs.threads,
  speed: r.profiler.speed,
  maxSize: r.result.maxRecommendedSize,
  maxUnits: r.result.recommendedNumUnits,
});

const handleBenchmarksIpc = (
  $mainWindow: Observable<BrowserWindow>,
  $nodeConfig: Observable<NodeConfig>
) => {
  const $req = fromIPC<{ benchmarks: BenchmarkRequest[]; dataDir: string }>(
    ipcConsts.RUN_BENCHMARKS
  );
  const $s = $req.pipe(withLatestFrom($nodeConfig, $mainWindow));
  const sub = $s.subscribe(
    async ([{ benchmarks, dataDir }, nodeConfig, mainWindow]) => {
      runBenchmarks(
        nodeConfig,
        (result) =>
          mainWindow.webContents.send(
            ipcConsts.SEND_BENCHMARK_RESULTS,
            convert(result)
          ),
        (errorResult) =>
          mainWindow.webContents.send(
            ipcConsts.SEND_BENCHMARK_ERROR,
            errorResult
          ),
        benchmarks,
        dataDir
      );
    }
  );
  return sub;
};

export default handleBenchmarksIpc;
