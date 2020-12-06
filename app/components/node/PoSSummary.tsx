import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from '../../basicComponents';
import { smColors } from '../../vars';
import { ComputeProvider, Status } from '../../types';
import PoSFooter from './PoSFooter';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  &:first-child {
    margin-bottom: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  text-transform: uppercase;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const linkStyle = { textTransform: 'uppercase', fontSize: '15px', lineHeight: '17px' };

type Props = {
  dataDir: string;
  commitmentSize: string;
  provider: ComputeProvider;
  throttle: boolean;
  nextAction: () => void;
  switchMode: ({ mode }: { mode: number }) => void;
  status: Status | null;
};

const PoSSummary = ({ dataDir, commitmentSize, provider, throttle, nextAction, switchMode, status }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextAction = () => {
    setIsProcessing(true);
    nextAction();
  };

  let providerType = 'UNSPECIFIED';
  if (provider.computeApi === '1') {
    providerType = 'CPU';
  } else if (provider.computeApi === '2') {
    providerType = 'CUDA';
  } else if (provider.computeApi === '3') {
    providerType = 'VULKAN';
  }

  return (
    <>
      <Row>
        <Text>data directory</Text>
        <Dots>.....................................................</Dots>
        <Link onClick={() => switchMode({ mode: 1 })} text={dataDir} style={linkStyle} isDisabled={isProcessing} />
      </Row>
      <Row>
        <Text>data size</Text>
        <Dots>.....................................................</Dots>
        <Link onClick={() => switchMode({ mode: 2 })} text={`${commitmentSize} GB`} style={linkStyle} isDisabled={isProcessing} />
      </Row>
      <Row>
        <Text>provider</Text>
        <Dots>.....................................................</Dots>
        <Link onClick={() => switchMode({ mode: 3 })} text={`${provider.model} (${providerType})`} style={linkStyle} isDisabled={isProcessing} />
      </Row>
      <Row>
        <Text>estimated time</Text>
        <Dots>.....................................................</Dots>
        <Link onClick={() => switchMode({ mode: 3 })} text={`${provider.performance} hashes per second`} style={linkStyle} isDisabled={isProcessing} />
      </Row>
      <Row>
        <Text>pause when pc is in use</Text>
        <Dots>.....................................................</Dots>
        <Link onClick={() => switchMode({ mode: 3 })} text={throttle ? 'on' : 'off'} style={linkStyle} isDisabled={isProcessing} />
      </Row>
      <PoSFooter action={handleNextAction} isDisabled={isProcessing || !status} isLastMode />
    </>
  );
};

export default PoSSummary;
