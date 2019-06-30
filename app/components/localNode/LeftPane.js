import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { resetNodeSettings } from '/redux/localNode/actions';
import { LoadingBar, LocalNodeLog, LocalNodeStatus } from '/components/localNode';
import { SmButton } from '/basicComponents';
import { localNodeModes } from '/vars';
import type { Action } from '/types';

const completeValue = 80; // TODO: change to actual complete value

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
`;

type CapacityAllocation = {
  id: number,
  label: string
};

type Props = {
  isInProgress: boolean,
  switchMode: (mode: number) => void,
  capacity: CapacityAllocation,
  progress: number,
  resetNodeSettings: Action
};

class LeftPane extends Component<Props> {
  timer: any;

  render() {
    const { capacity, isInProgress } = this.props;
    const status = isInProgress ? 'Connecting' : 'Active and Connected';
    return (
      <Wrapper>
        <Header>
          <LoadingBar isLoading={isInProgress} capacity={(capacity && capacity.label) || ''} status={status} />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ marginLeft: 20 }} />
        </Header>
        <LocalNodeStatus />
        <LocalNodeLog />
      </Wrapper>
    );
  }

  componentDidMount() {
    this.checkInitStatus();
  }

  componentDidUpdate() {
    this.checkInitStatus();
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  handleStopSetup = () => {
    const { resetNodeSettings, switchMode, isInProgress } = this.props;
    isInProgress && resetNodeSettings();
    switchMode(localNodeModes.SETUP);
  };

  checkInitStatus = () => {
    const { switchMode, progress } = this.props;
    if (progress === completeValue) {
      switchMode(localNodeModes.OVERVIEW);
    }
  };
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  progress: state.localNode.progress
});

const mapDispatchToProps = {
  resetNodeSettings
};

LeftPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPane);

export default LeftPane;
