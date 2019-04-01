import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { resetNodeSettings } from '/redux/localNode/actions';
import { LoadingBar, LocalNodeLog, LocalNodeStatus } from '/components/localNode';
import { SmButton } from '/basicComponents';
import { smColors, localNodeModes } from '/vars';
import type { Action } from '/types';

const LeftPaneInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

const LeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 22px 0;
  border-bottom: 1px solid ${smColors.borderGray};
  width: inherit;
  height: 62px;
`;

const BottomPaddedRow = styled(LeftPaneRow)`
  padding-top: 0;
  padding-bottom: 72px;
`;

type Props = {
  isInProgress: boolean,
  switchMode: (mode: number) => void,
  capacity: any,
  resetNodeSettings: Action
};

class LeftPane extends Component<Props> {
  timer: any;

  render() {
    const { capacity, isInProgress } = this.props;
    const status = isInProgress ? 'Connecting' : 'Active and Connected';
    return (
      <LeftPaneInner>
        <BottomPaddedRow>
          <LoadingBar isLoading={isInProgress} capacity={(capacity && capacity.label) || ''} status={status} />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </BottomPaddedRow>
        <LocalNodeStatus />
        <LocalNodeLog />
      </LeftPaneInner>
    );
  }

  // TODO: Test
  componentDidMount() {
    const { switchMode } = this.props;
    this.timer = setTimeout(() => {
      switchMode(localNodeModes.OVERVIEW);
    }, 8000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  handleStopSetup = () => {
    const { resetNodeSettings, switchMode, isInProgress } = this.props;
    isInProgress && resetNodeSettings();
    switchMode(localNodeModes.SETUP);
  };
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity
});

const mapDispatchToProps = {
  resetNodeSettings
};

LeftPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPane);

export default LeftPane;
