import React, { useState } from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { Tooltip } from '../../basicComponents';
import {
  DeviceType,
  NodeStatus,
  PostSetupProvider,
} from '../../../shared/types';
import { convertBytesToMiB } from '../../../shared/utils';
import PoSFooter from './PoSFooter';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  justify-content: space-between;
  &:not(:last-child):after {
    position: absolute;
    bottom: -10px;
    content: '';
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) =>
      theme.isDarkMode ? smColors.disabledGray10Alpha : smColors.black};
  }
  &:first-child {
    margin-bottom: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const TooltipWrap = styled.div`
  display: flex;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme: { color } }) => color.primary};
  text-transform: uppercase;
`;

const Link = styled.div<{ isDisabled: boolean }>`
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme: { color } }) => color.primary};
  font-size: 15px;
  line-height: 17px;
  cursor: pointer;
  &:hover {
    color: ${smColors.blue};
  }
  &.blue {
    text-decoration: underline;
    color: ${smColors.blue};
    &:hover {
      color: ${({ theme: { color } }) => color.primary};
    }
  }
`;

type Props = {
  dataDir: string;
  commitmentSize: string;
  provider: PostSetupProvider | undefined;
  throttle: boolean;
  nextAction: () => void;
  switchMode: ({ mode }: { mode: number }) => void;
  status: NodeStatus | null;
  maxFileSize: number;
};

const PoSSummary = ({
  dataDir,
  commitmentSize,
  provider,
  throttle,
  nextAction,
  switchMode,
  status,
  maxFileSize,
}: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextAction = () => {
    setIsProcessing(true);
    nextAction();
  };

  let providerType = 'UNKNOWN';
  if (provider?.deviceType === DeviceType.DEVICE_CLASS_CPU) {
    providerType = 'CPU';
  } else if (provider?.deviceType === DeviceType.DEVICE_CLASS_GPU) {
    providerType = 'GPU';
  }

  return (
    <>
      <Row>
        <Text>data directory</Text>
        <Link
          className="blue"
          onClick={() => switchMode({ mode: 1 })}
          isDisabled={isProcessing}
        >
          {dataDir}
        </Link>
      </Row>
      <Row>
        <Text>data size</Text>
        <Link onClick={() => switchMode({ mode: 2 })} isDisabled={isProcessing}>
          {commitmentSize}
        </Link>
      </Row>
      <Row>
        <Text>max file size</Text>
        <Link onClick={() => switchMode({ mode: 2 })} isDisabled={isProcessing}>
          {convertBytesToMiB(maxFileSize)} MiB
        </Link>
      </Row>
      <Row>
        <Text>provider</Text>
        <Link onClick={() => switchMode({ mode: 3 })} isDisabled={isProcessing}>
          {`${provider?.model} (${providerType})`}
        </Link>
      </Row>
      <Row>
        <TooltipWrap>
          <Text>data generation max speed</Text>
          <Tooltip
            width={100}
            text="Depending on the processor's capacity and availability. The final POS creation time might vary."
          />
        </TooltipWrap>
        <Link onClick={() => switchMode({ mode: 3 })} isDisabled={isProcessing}>
          {`${provider?.performance} hashes per second`}
        </Link>
      </Row>
      <Row>
        <Text>pause when pc is in use</Text>
        <Link onClick={() => switchMode({ mode: 3 })} isDisabled={isProcessing}>
          {throttle ? 'on' : 'off'}
        </Link>
      </Row>
      <PoSFooter
        action={handleNextAction}
        isDisabled={isProcessing || !status}
        isLastMode
      />
    </>
  );
};

export default PoSSummary;
