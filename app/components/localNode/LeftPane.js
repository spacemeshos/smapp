import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { resetNodeSettings, getLocalNodeSetupProgress } from '/redux/localNode/actions';
import { LoadingBar, LocalNodeLog, LocalNodeStatus } from '/components/localNode';
import { SmButton } from '/basicComponents';
import { localNodeModes } from '/vars';
import type { Action } from '/types';
import { notificationsService } from '/infra/notificationsService';

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

type Props = {
  isInProgress: boolean,
  switchMode: (mode: number) => void,
  capacity: any,
  progress: number,
  resetNodeSettings: Action,
  getLocalNodeSetupProgress: Action
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
    const { getLocalNodeSetupProgress } = this.props;
    this.checkInitStatus();
    this.timer = setInterval(() => {
      getLocalNodeSetupProgress();
    }, 10000);
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

  handleNotificationClick = ({ isClicked }: { isClicked: boolean }) => {
    // TODO: this need to be implemented to navigate to local node page when there are real status updates
    // eslint-disable-next-line no-console
    console.warn('notification clicked', isClicked);
  };

  checkInitStatus = () => {
    const { switchMode, progress } = this.props;
    if (progress === completeValue) {
      notificationsService.notify({
        title: 'Local Node',
        notification: 'Your full node setup is complete! You are now participating in the Spacemesh network!',
        callback: this.handleNotificationClick
      });
      switchMode(localNodeModes.OVERVIEW);
    }
  };
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  progress: state.localNode.progress
});

const mapDispatchToProps = {
  resetNodeSettings,
  getLocalNodeSetupProgress
};

LeftPane = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPane);

export default LeftPane;
