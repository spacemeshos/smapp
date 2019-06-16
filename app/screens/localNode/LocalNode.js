// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors, localNodeModes } from '/vars';
import { LeftPaneSetup, LeftPane, RightPane, SetAwardsAddress } from '/components/localNode';
import { connect } from 'react-redux';
import { getLocalNodeSetupProgress } from '/redux/localNode/actions';
import { withErrorBoundary, ErrorHandlerModal } from '/components/errorHandler';

const completeValue = 80; // TODO: change to actual complete value

const getStatupMode = ({ drive, capacity, progress }: { drive: any, capacity: any, progress: number }) => {
  if (progress === completeValue) {
    return localNodeModes.OVERVIEW;
  } else if (drive || capacity) {
    return localNodeModes.PROGRESS;
  }
  return localNodeModes.SETUP;
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 60px 90px;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Header = styled.div`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
  line-height: 42px;
`;

const LeftPaneWrapper = styled.div`
  text-align: left;
  flex: 2;
  padding: 30px 0;
  margin-right: 30px;
`;

type Props = {
  progress: number,
  capacity: any,
  drive: any
};

type State = {
  mode: number,
  shouldShowModal: boolean
};

class LocalNode extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { drive, capacity, progress } = props;
    getLocalNodeSetupProgress();
    this.state = {
      mode: getStatupMode({ drive, capacity, progress }),
      shouldShowModal: false
    };
  }

  render() {
    const { mode, shouldShowModal } = this.state;
    const header = `Local Node${mode !== localNodeModes.OVERVIEW ? ' Setup' : ''}`;
    return [
      <Wrapper key="wrapper">
        <Header>{header}</Header>
        <BodyWrapper>
          <LeftPaneWrapper>{this.renderLeftPane(mode)}</LeftPaneWrapper>
          <RightPane mode={mode} switchMode={(mode: number) => this.setState({ mode })} openSetAwardsAddressModal={() => this.setState({ shouldShowModal: true })} />
        </BodyWrapper>
      </Wrapper>,
      shouldShowModal && <SetAwardsAddress key="modal" onSave={() => this.setState({ shouldShowModal: false })} closeModal={() => this.setState({ shouldShowModal: false })} />
    ];
  }

  // TODO: Test - uncomment the following componentDidMount to trigger error with error handling infra
  // componentDidMount() {
  //   throw new Error('ERROR !!!!');
  // }

  renderLeftPane = (mode: number) => {
    switch (mode) {
      case localNodeModes.SETUP:
        return <LeftPaneSetup switchMode={this.handleModeChange} />;
      case localNodeModes.PROGRESS:
        return <LeftPane isInProgress switchMode={this.handleModeChange} />;
      case localNodeModes.OVERVIEW:
        return <LeftPane isInProgress={false} switchMode={this.handleModeChange} />;
      default:
        return null;
    }
  };

  handleModeChange = (mode: number) => {
    this.setState({ mode });
  };
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  drive: state.localNode.drive,
  progress: state.localNode.progress
});

const mapDispatchToProps = {
  getLocalNodeSetupProgress
};

LocalNode = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNode);

export default withErrorBoundary(
  LocalNode,
  ErrorHandlerModal,
  (error, componentStack) => {
    // TODO: Test onError
    // eslint-disable-next-line no-console
    console.warn('error', error, 'component stack', componentStack);
  },
  ({ action }: { action: 'refresh' | 'go back' | 'retry' | 'cancel' }) => {
    // TODO: trigger actions - find a way to statically route / other solution
    // eslint-disable-next-line no-console
    console.warn('action', action);
    switch (action) {
      case 'refresh':
        break;
      case 'go back':
        break;
      case 'retry':
        break;
      case 'cancel':
        break;
      default:
        break;
    }
  },
  { canRefresh: true, canRetry: true, canGoBack: true }
);
