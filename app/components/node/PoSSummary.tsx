import React, { useState } from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { Status } from '../../types';
import { Tooltip } from '../../basicComponents';
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
    background: ${({ theme }) => (theme.isDarkMode ? smColors.disabledGray10Alpha : smColors.black)};
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
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  text-transform: uppercase;
`;

const Link = styled.div`
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  fontsize: 15px;
  line-height: 17px;
  cursor: pointer;
  &:hover {
    color: ${smColors.blue};
  }
  &.blue {
    text-decoration: underline;
    color: ${smColors.blue};
    &:hover {
      color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
    }
  }
`;

type Props = {
  folder: string;
  commitment: number;
  processor: any;
  isPausedOnUsage: boolean;
  nextAction: () => void;
  switchMode: ({ mode }: { mode: number }) => void;
  status: Status | null;
  isDarkMode: boolean;
};

const PoSSummary = ({ folder, commitment, isDarkMode, processor, isPausedOnUsage, nextAction, switchMode, status }: Props) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextAction = () => {
    setIsProcessing(true);
    nextAction();
  };

  return (
    <>
      <Row>
        <Text>data directory</Text>
        <Link className="blue" onClick={() => switchMode({ mode: 1 })}>
          {folder}
        </Link>
      </Row>
      <Row>
        <Text>data size</Text>
        <Link onClick={() => switchMode({ mode: 2 })}>{`${commitment} GB`}</Link>
      </Row>
      <Row>
        <Text>processor</Text>
        <Link onClick={() => switchMode({ mode: 3 })}>{`${processor.company} ${processor.type}`}</Link>
      </Row>
      <Row>
        <TooltipWrap>
          <Text>estimated setup time</Text>
          <Tooltip width={100} text="Placeholder text" isDarkMode={isDarkMode} />
        </TooltipWrap>
        <Link onClick={() => switchMode({ mode: 3 })}>{processor.estimation}</Link>
      </Row>
      <Row>
        <Text>pause when pc is in use</Text>
        <Link onClick={() => switchMode({ mode: 3 })}>{isPausedOnUsage ? 'on' : 'off'}</Link>
      </Row>
      <PoSFooter action={handleNextAction} isDisabled={isProcessing || !status} isLastMode />
    </>
  );
};

export default PoSSummary;
