import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip } from '../../basicComponents';
import { smColors } from '../../vars';
import { Status } from '../../types';
import Carousel from './Carousel';
import Checkbox from './Checkbox';
import PoSFooter from './PoSFooter';

const PauseSelector = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const data = [
  { company: 'nvidia geforce', name: 'rtx 2700 (cuda)', isGPU: true, estimation: '24 hours' },
  { company: 'nvidia geforce', name: 'rtx 2700 (vulkan)', isGPU: true, estimation: 'xx hours' },
  { company: 'amd phenom ii', name: 'x4 955 cpu', isGPU: false, estimation: 'xx hours' }
];

type Props = {
  processor: any;
  setProcessor: (processor: any) => void;
  isPausedOnUsage: boolean;
  setIsPausedOnUsage: (isPauseOnUsage: boolean) => void;
  nextAction: () => void;
  status: Status | null;
  isDarkMode: boolean;
};

const PoSProcessor = ({ processor, setProcessor, isPausedOnUsage, setIsPausedOnUsage, nextAction, status, isDarkMode }: Props) => {
  const [selectedProcessorIndex, setSelectedProcessorIndex] = useState(
    processor ? data.findIndex(({ company, name }) => company === processor.company && name === processor.name) : -1
  );

  const handleSetProcessor = ({ index }: { index: number }) => {
    setSelectedProcessorIndex(index);
    setProcessor(data[index]);
  };

  return (
    <>
      <Carousel data={data} onClick={handleSetProcessor} selectedItemIndex={selectedProcessorIndex} />
      <PauseSelector>
        <Checkbox isChecked={isPausedOnUsage} check={() => setIsPausedOnUsage(!isPausedOnUsage)} />
        <Text>PAUSE WHEN SOMEONE IS USING THIS COMPUTER</Text>
        <Tooltip width={200} text="Some text" isDarkMode={isDarkMode} />
      </PauseSelector>
      <PoSFooter action={nextAction} isDisabled={selectedProcessorIndex === -1 || !status} />
    </>
  );
};

export default PoSProcessor;
