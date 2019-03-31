import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors, localNodeModes } from '/vars';
import { SmButton } from '/basicComponents';
import { LoadingBar, LocalNodeLog, LocalNodeStatus } from '/components/localNode';
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
  inProgress: boolean,
  toMode: Funtion,
  capacity: any,
  resetNodeSettings: Action
};

class LeftPane extends Component<Props> {
  timer: any;

  render() {
    const { capacity, inProgress } = this.props;
    const status = inProgress ? 'Connecting' : 'Active and Connected';
    return (
      <LeftPaneInner>
        <BottomPaddedRow>
          <LoadingBar isLoading={inProgress} capacity={(capacity && capacity.label) || ''} status={status} />
          <SmButton theme="green" text="Stop" onPress={this.handleStopSetup} style={{ height: 44, marginLeft: 32 }} />
        </BottomPaddedRow>
        <LocalNodeStatus />
        <LocalNodeLog />
      </LeftPaneInner>
    );
  }

  // Test
  componentDidMount() {
    const { toMode } = this.props;
    this.timer = setTimeout(() => {
      toMode(localNodeModes.OVERVIEW);
    }, 8000);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  // end test

  handleStopSetup = () => {
    const { resetNodeSettings, toMode, inProgress } = this.props;
    inProgress && resetNodeSettings();
    toMode(localNodeModes.SETUP);
  };
}

export default LeftPane;
