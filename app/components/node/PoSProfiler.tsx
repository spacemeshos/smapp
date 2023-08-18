import { ipcRenderer } from 'electron';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Tooltip,
  Input,
  Button,
  ColorStatusIndicator,
} from '../../basicComponents';
import { constrain, formatBytes } from '../../infra/utils';
import { ipcConsts, smColors } from '../../vars';
import { BenchmarkRequest, BenchmarkResponse } from '../../../shared/types';
import { eventsService } from '../../infra/eventsService';
import PoSFooter, { PoSFooterProps } from './PoSFooter';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  position: relative;
  :first-child {
    margin-bottom: 10px;
  }
  :last-child {
    margin-bottom: 30px;
  }
  font-size: 12px;
`;

const Filler = styled.div`
  flex: 1;
`;

const Table = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;
const TRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;
const TScroll = styled.div`
  display: flex;
  width: 100%;
  height: 120px;
  flex-direction: column;
  overflow: auto;

  & ${TRow}:hover {
    background-color: ${smColors.darkGray50Alpha};
  }
`;
const TCol = styled.div`
  display: flex;
  width: ${({ width }: { width: string }) => width};
  padding: 6px;
`;

const Text = styled.div`
  font-size: 1.2em;
  line-height: 1.4em;
  color: ${({ theme: { color } }) => color.primary};
`;

const COL_WIDTH = {
  NONCES: '18%',
  THREADS: '18%',
  SPEED: '18%',
  SIZE: '26%',
  STATUS: '20%',
  REST: '64%', // SPEED + SIZE + STATUS
};

const MaxLabel = styled.span`
  &:before {
    display: inline;
    content: 'MAX';
  }
  display: inline-block;
  font-weight: 800;
  color: ${smColors.purple};
  padding: 0 0.5em;
`;

type Props = {
  nextAction: (nonces: number, threads: number, numUnits?: number) => void;
  numUnitSize: number;
  maxUnits: number;
  dataDir: string;
  nonces?: number | undefined;
  threads?: number | undefined;
  posFooterProps?: Partial<PoSFooterProps>;
};

enum BenchmarkStatus {
  Idle = 'Idle',
  Queued = 'Queued',
  Running = 'Running',
  Complete = 'Complete',
}

type Benchmark = {
  nonces: number;
  threads: number;
  speed: number | null;
  maxSize: number | null;
  maxUnits: number | null;
  status: BenchmarkStatus;
};

const defaultizeBenchmark = (nonces: number, threads: number): Benchmark => ({
  nonces,
  threads,
  speed: null,
  maxSize: null,
  maxUnits: null,
  status: BenchmarkStatus.Idle,
});

const createBenchmarks = (input: [number, number][]) =>
  input.map(
    ([nonces, threads]): Benchmark => defaultizeBenchmark(nonces, threads)
  );

const roundToMultipleOf = (base: number) => (n: number) =>
  Math.round(Math.abs(n) / base) * base;

const maxCpuThreads = navigator.hardwareConcurrency;
const maxCpuAvailable = maxCpuThreads - 1;

const callOnChangeWithInt = (fn: (newValue: number | null) => void) => ({
  value,
}: {
  value: string;
}) => {
  const v = parseInt(value, 10);
  if (Number.isNaN(v)) {
    fn(null);
  } else {
    fn(v);
  }
};

const updateBenchmarks = (
  old: Benchmark[],
  next: Benchmark,
  isRunningBatch: boolean
): Benchmark[] => {
  const existingIndex = old.findIndex(
    (b) => b.nonces === next.nonces && b.threads === next.threads
  );
  if (existingIndex === -1) {
    return [...old, next];
  }
  return [
    ...old.slice(0, existingIndex),
    next,
    ...old.slice(existingIndex + 1).map((b, i) => ({
      ...b,
      // In case we run a bunch of benchmarks —
      // change the status of next one
      // eslint-disable-next-line no-nested-ternary
      status: !isRunningBatch
        ? b.status
        : i === 0 && next.status === BenchmarkStatus.Complete
        ? BenchmarkStatus.Running
        : BenchmarkStatus.Queued,
    })),
  ];
};

const getStatusColor = (status: BenchmarkStatus) => {
  switch (status) {
    case BenchmarkStatus.Complete:
      return smColors.green;
    case BenchmarkStatus.Running:
      return smColors.orange;
    case BenchmarkStatus.Idle:
    case BenchmarkStatus.Queued:
    default:
      return smColors.vaultDarkGrey;
  }
};

const PoSProfiler = ({
  nextAction,
  numUnitSize,
  maxUnits,
  dataDir,
  threads,
  nonces,
  posFooterProps = {},
}: Props) => {
  const [noncesValue, setNoncesValue] = useState<number | null>(nonces || 288);
  const [threadsValue, setThreadsValue] = useState<number | null>(
    threads || maxCpuAvailable
  );
  const [isRunningBatch, setRunningBatch] = useState(false);
  const [benchmarks, setBenchmarks] = useState(
    createBenchmarks([
      [16, 1],
      [64, 1],
      [128, Math.floor(maxCpuThreads / 2)],
      [288, maxCpuAvailable],
    ])
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRunning = !!benchmarks.find(
    (b) =>
      b.status !== BenchmarkStatus.Idle && b.status !== BenchmarkStatus.Complete
  );

  const maxSize = numUnitSize * maxUnits;

  const setAndScrollBenchmarks = (next: Benchmark[]) => {
    setBenchmarks(next);
    scrollRef.current?.scrollTo({
      behavior: 'smooth',
      top: scrollRef.current.scrollHeight,
    });
  };

  useEffect(() => {
    const handler = (_event, result: BenchmarkResponse) =>
      setAndScrollBenchmarks(
        updateBenchmarks(
          benchmarks,
          {
            ...result,
            status: BenchmarkStatus.Complete,
          },
          isRunningBatch
        )
      );

    ipcRenderer.on(ipcConsts.SEND_BENCHMARK_RESULTS, handler);
    return () => {
      ipcRenderer.off(ipcConsts.SEND_BENCHMARK_RESULTS, handler);
    };
  }, [benchmarks, isRunningBatch]);

  const runSingleBenchmark = (req: BenchmarkRequest) => {
    setRunningBatch(false);
    setAndScrollBenchmarks(
      updateBenchmarks(
        benchmarks,
        {
          ...defaultizeBenchmark(req.nonces, req.threads),
          status: BenchmarkStatus.Running,
        },
        isRunningBatch
      )
    );
    eventsService.runBenchmarks([req], dataDir);
  };

  const runBenchmarks = () => {
    setRunningBatch(true);
    setAndScrollBenchmarks(
      updateBenchmarks(
        benchmarks,
        {
          ...benchmarks[0],
          status: BenchmarkStatus.Running,
        },
        isRunningBatch
      )
    );
    eventsService.runBenchmarks(benchmarks, dataDir);
  };

  const roundTo16 = roundToMultipleOf(16);
  const goNext = () => {
    if (!noncesValue || !threadsValue) return;
    const numUnits = benchmarks.find(
      (b) => b.nonces === noncesValue && b.threads === threadsValue
    )?.maxUnits;
    nextAction(noncesValue, threadsValue, numUnits ?? undefined);
  };
  return (
    <>
      <Row>
        <Text>
          Smesher should be able to generate PoS proof in time. To choose proper
          options for proof generation — run the benchmark and follow the hints.
        </Text>
      </Row>
      <Row>
        <Text>Benchmarks:</Text>
        <Tooltip
          width={250}
          text="The Node need to find a valid Nonce to prove PoST. Since it uses disk reads and CPU we recommend to run benchmarks and choose the best option"
        />
      </Row>
      <Row>
        <Table>
          <TRow>
            <TCol width={COL_WIDTH.NONCES}>
              Nonces
              <Tooltip
                width={250}
                marginTop={0}
                text="Amount of nonces generated per one read. On a slow CPU you may consider reducing amount of nonces or size of your PoS data."
              />
            </TCol>
            <TCol width={COL_WIDTH.THREADS}>
              CPU&nbsp;Threads
              <Tooltip
                width={250}
                marginTop={0}
                text="How many CPU cores can be used at the same time. More CPU — less time is needed to generate nonces."
              />
            </TCol>
            <TCol width={COL_WIDTH.SPEED}>
              Speed,&nbsp;GiB/s
              <Tooltip
                width={250}
                marginTop={0}
                text="Speed of reading PoS and finding nonces in gibibytes per second"
              />
            </TCol>
            <TCol width={COL_WIDTH.SIZE}>
              Recommended PoS size
              <Tooltip
                width={250}
                marginTop={0}
                text="Allocate not more than this amount to be sure that your machine is able to produce the proof in time."
              />
            </TCol>
            <TCol width={COL_WIDTH.STATUS}>Status</TCol>
          </TRow>
          <TScroll ref={scrollRef}>
            {benchmarks.map((r, i) => (
              <TRow
                key={`Bench_${r.nonces}_${r.threads}_${i}`}
                onClick={() => {
                  setNoncesValue(r.nonces);
                  setThreadsValue(r.threads);
                }}
              >
                <TCol width={COL_WIDTH.NONCES}>{r.nonces}</TCol>
                <TCol width={COL_WIDTH.THREADS}>{r.threads}</TCol>
                <TCol width={COL_WIDTH.SPEED}>
                  {r.speed?.toPrecision(4) ?? '...'}
                </TCol>
                <TCol width={COL_WIDTH.SIZE}>
                  {r.maxSize ? formatBytes(r.maxSize) : '...'}
                  {r.maxSize === maxSize && <MaxLabel />}
                </TCol>
                <TCol width={COL_WIDTH.STATUS}>
                  <ColorStatusIndicator color={getStatusColor(r.status)} />
                  {r.status === BenchmarkStatus.Complete
                    ? 'Click to select'
                    : r.status}
                </TCol>
              </TRow>
            ))}
          </TScroll>
          <TRow>
            <TCol width={COL_WIDTH.NONCES}>
              <Input
                onChange={callOnChangeWithInt(setNoncesValue)}
                onBlur={({ value }) =>
                  value !== '' && setNoncesValue(roundTo16(parseInt(value, 10)))
                }
                value={noncesValue ?? ''}
              />
            </TCol>
            <TCol width={COL_WIDTH.THREADS}>
              <Input
                onChange={callOnChangeWithInt(setThreadsValue)}
                onBlur={({ value }) =>
                  value !== '' &&
                  setThreadsValue(
                    constrain(1, maxCpuAvailable, parseInt(value, 10))
                  )
                }
                value={threadsValue ?? ''}
              />
            </TCol>
            <TCol width={COL_WIDTH.REST}>
              <Filler />
              <Button
                onClick={() =>
                  noncesValue &&
                  threadsValue &&
                  runSingleBenchmark({
                    nonces: noncesValue,
                    threads: threadsValue,
                  })
                }
                isPrimary={false}
                isDisabled={
                  isRunning ||
                  !noncesValue ||
                  !threadsValue ||
                  benchmarks.find(
                    ({ nonces, threads, status }) =>
                      noncesValue === nonces &&
                      threadsValue === threads &&
                      status !== BenchmarkStatus.Idle
                  ) !== undefined
                }
                width={180}
                text="TEST CHOSEN OPTIONS"
                style={{ marginRight: 5 }}
              />
              <Button
                isPrimary
                isDisabled={
                  isRunning ||
                  benchmarks.reduce(
                    (prev, next) =>
                      prev && next.status === BenchmarkStatus.Complete,
                    true
                  )
                }
                onClick={() => runBenchmarks()}
                width={165}
                text="RUN ALL BENCHMARKS"
              />
            </TCol>
          </TRow>
        </Table>
      </Row>
      <PoSFooter
        action={goNext}
        {...posFooterProps}
        isDisabled={
          !noncesValue || !threadsValue || Boolean(posFooterProps?.isDisabled)
        }
      />
    </>
  );
};

export default PoSProfiler;
