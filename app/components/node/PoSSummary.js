// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from '/basicComponents';
import { smColors } from '/vars';
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
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
  text-transform: uppercase;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
`;

const linkStyle = { textTransform: 'uppercase', fontSize: '15px', lineHeight: '17px' };

type Props = {
  folder: string,
  commitment: string,
  processor: string,
  isPausedOnUsage: boolean,
  nextAction: () => void,
  switchMode: ({ mode: number }) => void,
  status: Object
};

type State = {
  isProcessing: boolean
};

class PoSSummary extends Component<Props, State> {
  state = {
    isProcessing: false
  };

  render() {
    const { folder, commitment, processor, isPausedOnUsage, switchMode, status } = this.props;
    const { isProcessing } = this.state;
    return (
      <>
        <Row>
          <Text>data directory</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 1 })} text={folder} style={linkStyle} isDisabled={isProcessing} />
        </Row>
        <Row>
          <Text>data size</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 2 })} text={`${commitment} GB`} style={linkStyle} isDisabled={isProcessing} />
        </Row>
        <Row>
          <Text>processor</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 3 })} text={`${processor.company} ${processor.type}`} style={linkStyle} isDisabled={isProcessing} />
        </Row>
        <Row>
          <Text>estimated time</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 3 })} text={processor.estimation} style={linkStyle} isDisabled={isProcessing} />
        </Row>
        <Row>
          <Text>pause when pc is in use</Text>
          <Dots>.....................................................</Dots>
          <Link onClick={() => switchMode({ mode: 3 })} text={isPausedOnUsage ? 'on' : 'off'} style={linkStyle} isDisabled={isProcessing} />
        </Row>
        <PoSFooter action={this.nextAction} isDisabled={isProcessing || !status} isLastMode />
      </>
    );
  }

  nextAction = () => {
    const { nextAction } = this.props;
    this.setState({ isProcessing: true });
    nextAction({});
  };
}

export default PoSSummary;
