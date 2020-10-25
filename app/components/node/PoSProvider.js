// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip } from '/basicComponents';
import { eventsService } from '/infra/eventsService';
import { smColors } from '/vars';
import Carousel from './Carousel';
import Checkbox from './Checkbox';
import PoSFooter from './PoSFooter';
import type { NodeStatus } from '/types';

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

const ErrorText = styled.div`
  font-size: 20px;
  line-height: 25px;
  color: ${smColors.red};
`;

type Props = {
  provider: { id: number, model: string, computeApi: string, performance: number },
  throttle: boolean,
  nextAction: () => void,
  status: NodeStatus
};

type State = {
  postComputeProviders: [{ id: number, model: string, computeApi: string, performance: number }] | null,
  selectedProviderIndex: number,
  throttle: boolean
};

class PoSProvider extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      postComputeProviders: null,
      selectedProviderIndex: -1,
      throttle: props.throttle
    };
  }

  render() {
    const { nextAction, status } = this.props;
    const { postComputeProviders, selectedProviderIndex, throttle } = this.state;
    return (
      <>
        {!postComputeProviders ? (
          <Text>CALCULATING POS PROCESSORS</Text>
        ) : (
          <Carousel data={postComputeProviders} onClick={this.setProvider} selectedItemIndex={selectedProviderIndex} />
        )}
        {postComputeProviders && postComputeProviders.length === 0 && <ErrorText>NO SUPPORTED PROCESSOR DETECTED</ErrorText>}
        <PauseSelector>
          <Checkbox isChecked={throttle} check={() => this.setState({ throttle: !throttle })} />
          <Text>PAUSE WHEN SOMEONE IS USING THIS COMPUTER</Text>
          <Tooltip top={-2} left={-3} width={200} text="Some text" />
        </PauseSelector>
        <PoSFooter action={() => nextAction({ provider: postComputeProviders[selectedProviderIndex], throttle })} isDisabled={selectedProviderIndex === -1 || !status} />
      </>
    );
  }

  async componentDidMount() {
    const { provider } = this.props;
    const { error, postComputeProviders } = await eventsService.getPostComputeProviders();
    if (error) {
      this.setState({ postComputeProviders: [] });
    } else {
      this.setState({ postComputeProviders, selectedProviderIndex: provider ? postComputeProviders.find((curProcessor) => curProcessor.model === provider.model) : -1 });
    }
  }

  setProvider = ({ index }: { index: number }) => {
    this.setState({ selectedProviderIndex: index });
  };
}

export default PoSProvider;
