// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from '/basicComponents';
import { smColors } from '/vars';
import PoSFooter from './PoSFooter';
import type { NodeStatus } from '/types';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const color = isDarkModeOn ? smColors.white : smColors.black;

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
  color: ${color};
  text-transform: uppercase;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${color};
`;

const linkStyle = { textTransform: 'uppercase', fontSize: '15px', lineHeight: '17px' };

type Props = {
  folder: string,
  commitment: string,
  processor: { id: number, model: string, computeApi: string, performance: number },
  throttle: boolean,
  nextAction: () => void,
  switchMode: ({ mode: number }) => void,
  status: NodeStatus
};

type State = {
  isSubmitting: boolean
};

class PoSSummary extends Component<Props, State> {
  state = {
    isSubmitting: false
  };

  render() {
    const { folder, commitment, processor, throttle, switchMode, status } = this.props;
    const { isSubmitting } = this.state;
    return (
      <>
        <Row>
          <Text>data directory</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 1 })} text={folder} style={linkStyle} isDisabled={isSubmitting} />
        </Row>
        <Row>
          <Text>data size</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 2 })} text={`${commitment} GB`} style={linkStyle} isDisabled={isSubmitting} />
        </Row>
        <Row>
          <Text>processor</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 3 })} text={`${processor.model} ${processor.computeApi}`} style={linkStyle} isDisabled={isSubmitting} />
        </Row>
        <Row>
          <Text>estimated time</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 3 })} text={processor.performance} style={linkStyle} isDisabled={isSubmitting} />
        </Row>
        <Row>
          <Text>pause when pc is in use</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 3 })} text={throttle ? 'on' : 'off'} style={linkStyle} isDisabled={isSubmitting} />
        </Row>
        <PoSFooter action={this.nextAction} isDisabled={isSubmitting || !status} isLastMode />
      </>
    );
  }

  nextAction = () => {
    const { nextAction } = this.props;
    this.setState({ isSubmitting: true });
    nextAction({});
  };
}

export default PoSSummary;
