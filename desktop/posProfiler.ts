import { resolve } from 'path';
import { unlink } from 'fs/promises';
import { app } from 'electron';
import spawn from 'cross-spawn';
import parse from 'parse-duration';
import { BenchmarkRequest, NodeConfig } from '../shared/types';
import { BITS_PER_LABEL } from '../shared/constants';
import { constrain } from '../app/infra/utils';
import { getProfilerPath } from './main/binaries';

// Percentage of cycle-gap that are used in max data size calculation
// to ensure that User will have enough time to create a proof
const K_SAFE_PERIOD = 0.7;

export interface PosProfilerOptions {
  datafile: string;
  datasize: number;
  nonces: number;
  threads: number;
}

interface PosProfilerResult {
  time: number; // sec
  speed: number; // GiB / sec
}

interface BenchmarkResult {
  maxRecommendedSize: number;
  recommendedNumUnits: number;
}

export interface BenchmarkRunResult {
  inputs: PosProfilerOptions;
  profiler: PosProfilerResult;
  result: BenchmarkResult;
}

export const runProfiler = (
  opts: PosProfilerOptions
): Promise<PosProfilerResult> =>
  new Promise((resolve, reject) => {
    const cp = spawn(getProfilerPath(), [
      `--data-file=${opts.datafile}`,
      `--data-size=${opts.datasize}`,
      `--nonces=${opts.nonces}`,
      `--threads=${opts.threads}`,
    ]);

    const out = {
      stderr: '',
      stdout: '',
    };
    const appendTo = (key: keyof typeof out) => (data: string) => {
      out[key] += data;
    };
    cp.on('error', reject);
    cp.on('close', (code) => {
      if (code && code > 0) {
        reject(new Error(out.stderr));
      }
      const res = JSON.parse(out.stdout);
      if (
        typeof res.time_s !== 'number' ||
        typeof res.speed_gib_s !== 'number'
      ) {
        reject(new Error(`Invalid output of PoS profiler tool: ${out.stdout}`));
      }
      return resolve({
        time: res.time_s,
        speed: res.speed_gib_s,
      });
    });
    cp.stderr?.on('data', appendTo('stderr'));
    cp.stdout?.on('data', appendTo('stdout'));
  });

const gibsTobytes = (gib: number) => gib * 1024 ** 3;

export const calculateMaxDatasize = (cycleGap: number, speed: number) =>
  gibsTobytes(cycleGap * K_SAFE_PERIOD * speed);

export const runSingleBenchmark = async (
  cycleGap: number,
  unitSize: number,
  maxPossibleSize: number,
  profilerOpts: PosProfilerOptions
): Promise<BenchmarkRunResult> => {
  const profiler = await runProfiler(profilerOpts);
  // Let's assume that 288 nonces has about 100% chance to generate the proof
  // so everything is less — we'd like to have a chance to try generate it
  // a couple of times. Therefore, we calculate how many times and divide max size
  // with the recommended amount of retries
  const recommendedRetries = Math.max(
    1,
    profilerOpts.nonces < 288 ? Math.ceil(288 / profilerOpts.nonces) : 1
  );
  const maxRecommendedSize = constrain(
    0,
    maxPossibleSize,
    calculateMaxDatasize(cycleGap, profiler.speed) / recommendedRetries
  );
  const recommendedNumUnits = Math.floor(maxRecommendedSize / unitSize);
  const roundSizeToUnits = recommendedNumUnits * unitSize;
  return {
    inputs: profilerOpts,
    profiler,
    result: {
      maxRecommendedSize: roundSizeToUnits,
      recommendedNumUnits,
    },
  };
};

export const runBenchmarks = async (
  nodeConfig: NodeConfig,
  progressCb: (result: BenchmarkRunResult) => void,
  benchmarks: BenchmarkRequest[],
  dataDir: string
): Promise<void> => {
  const cycleGap = parse(nodeConfig.poet['cycle-gap']) / 1000; // in seconds
  const unitSize =
    (nodeConfig.post['post-labels-per-unit'] * BITS_PER_LABEL) / 8;
  const maxPossibleSize = nodeConfig.post['post-max-numunits'] * unitSize;

  const defaultProfilerOpts: PosProfilerOptions = {
    datafile: resolve(dataDir || app.getPath('temp'), 'profiler.bin'),
    datasize: 1,
    nonces: 16,
    threads: 1,
  };

  return benchmarks
    .map((req) => ({ ...defaultProfilerOpts, ...req }))
    .reduce(
      (acc, benchmark) =>
        acc
          .then(() =>
            runSingleBenchmark(cycleGap, unitSize, maxPossibleSize, benchmark)
          )
          .then(progressCb),
      Promise.resolve()
    )
    .then(() => unlink(defaultProfilerOpts.datafile));
};
