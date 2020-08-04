// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip } from '/basicComponents';
import { tooltip } from '/assets/images';
import { smColors } from '/vars';
import Carousel from './Carousel';
import PoSFooter from './PoSFooter';

const PauseSelector = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.black};
`;

const TooltipIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const CustomTooltip = styled(Tooltip)`
  top: -2px;
  left: -3px;
  width: 200px;
  background-color: ${smColors.disabledGray};
  border: 1px solid ${smColors.realBlack};
`;

const TooltipWrapper = styled.div`
  position: relative;
  margin-left: 5px;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

const data = [
  { company: 'nvidia geforce', type: 'rtx 2700 (cuda)', estimation: '24 hours' },
  { company: 'nvidia geforce', type: 'rtx 2700 (vulkan)', estimation: 'xx hours' },
  { company: 'amd phenom ii', type: 'x4 955 cpu', estimation: 'xx hours' }
];

type Props = {
  processor: Object,
  nextAction: () => void,
  status: Object
};

type State = {
  selectedProcessorIndex: number,
  pauseOnUsage: boolean
};

class PoSProcessor extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedProcessorIndex: props.processor ? data.findIndex(({ company, type }) => company === props.processor.company && type === props.processor.type) : -1,
      pauseOnUsage: false
    };
  }

  render() {
    const { nextAction, status } = this.props;
    const { selectedProcessorIndex, pauseOnUsage } = this.state;
    return (
      <>
        <Carousel data={data} onClick={this.setProcessor} selectedItemIndex={selectedProcessorIndex} />
        <PauseSelector>
          <Text>PAUSE WHEN SOMEONE IS USING THIS COMPUTER</Text>
          <TooltipWrapper>
            <TooltipIcon src={tooltip} />
            <CustomTooltip text="Some text" />
          </TooltipWrapper>
        </PauseSelector>
        <PoSFooter action={() => nextAction({ processor: data[selectedProcessorIndex], pauseOnUsage })} isDisabled={selectedProcessorIndex === -1 || !status} />
      </>
    );
  }

  setProcessor = ({ index }: { index: number }) => {
    this.setState({ selectedProcessorIndex: index });
  };
}

export default PoSProcessor;
