// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip } from '/basicComponents';
import { smColors } from '/vars';
import Carousel from './Carousel';
import Checkbox from './Checkbox';
import PoSFooter from './PoSFooter';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const PauseSelector = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const data = [
  { company: 'nvidia geforce', name: 'rtx 2700 (cuda)', isGPU: true, estimation: '24 hours' },
  { company: 'nvidia geforce', name: 'rtx 2700 (vulkan)', isGPU: true, estimation: 'xx hours' },
  { company: 'amd phenom ii', name: 'x4 955 cpu', isGPU: false, estimation: 'xx hours' }
];

type Props = {
  processor: Object,
  isPausedOnUsage: boolean,
  nextAction: () => void,
  status: Object
};

type State = {
  selectedProcessorIndex: number,
  isPausedOnUsage: boolean
};

class PoSProcessor extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedProcessorIndex: props.processor ? data.findIndex(({ company, type }) => company === props.processor.company && type === props.processor.type) : -1,
      isPausedOnUsage: props.isPausedOnUsage
    };
  }

  render() {
    const { nextAction, status } = this.props;
    const { selectedProcessorIndex, isPausedOnUsage } = this.state;
    return (
      <>
        <Carousel data={data} onClick={this.setProcessor} selectedItemIndex={selectedProcessorIndex} />
        <PauseSelector>
          <Checkbox isChecked={isPausedOnUsage} check={() => this.setState({ isPausedOnUsage: !isPausedOnUsage })} />
          <Text>PAUSE WHEN SOMEONE IS USING THIS COMPUTER</Text>
          <Tooltip width={200} text="Some text" isDarkModeOn={isDarkModeOn} />
        </PauseSelector>
        <PoSFooter action={() => nextAction({ processor: data[selectedProcessorIndex], isPausedOnUsage })} isDisabled={selectedProcessorIndex === -1 || !status} />
      </>
    );
  }

  setProcessor = ({ index }: { index: number }) => {
    this.setState({ selectedProcessorIndex: index });
  };
}

export default PoSProcessor;
