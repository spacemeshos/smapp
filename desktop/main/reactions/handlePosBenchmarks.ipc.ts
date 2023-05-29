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
  const $req = fromIPC<BenchmarkRequest[]>(ipcConsts.RUN_BENCHMARKS);
  const $s = $req.pipe(withLatestFrom($nodeConfig, $mainWindow));
  const sub = $s.subscribe(async ([benchmarks, nodeConfig, mainWindow]) => {
    runBenchmarks(
      nodeConfig,
      (result) =>
        mainWindow.webContents.send(
          ipcConsts.SEND_BENCHMARK_RESULTS,
          convert(result)
        ),
      benchmarks
    );
  });
  return sub;
};

export default handleBenchmarksIpc;
