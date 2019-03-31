// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLocalNodeStorage, getDrivesList, getAvailableSpace } from '/redux/localNode/actions';
import { getFiatRate } from '/redux/wallet/actions';
import styled from 'styled-components';
import { smColors } from '/vars';
import { LeftPaneSetup, RightPane } from '/components/localNode';
import type { Action } from '/types';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 60px 90px;
`;

const BodyWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const Header = styled.span`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.darkGray};
`;

const LeftPaneWrapper = styled.div`
  text-align: left;
  flex: 2;
  padding: 24px 0;
  margin-right: 32px;
`;

const RightPaneWrapper = styled.div`
  flex: 1;
  background-color: white;
  padding: 30px;
  border: 1px solid ${smColors.borderGray};
`;

type Mode = 'setup' | 'progress' | 'overview';

type Props = {
  drives: any[],
  capacity: any,
  capacityAllocationsList: any[],
  drive: any,
  availableDiskSpace: { bytes: number, readable: string },
  setLocalNodeStorage: Action,
  getDrivesList: Action,
  getFiatRate: Action,
  getAvailableSpace: Action,
  fiatRate: number
};

type State = {
  mode: Mode
};

class LocalNode extends Component<Props, State> {
  state = {
    mode: 'setup'
  };

  render() {
    const { mode } = this.state;
    const header = `Local Node${mode !== 'overview' ? ' Setup' : ''}`;
    return (
      <Container>
        <Header>{header}</Header>
        <BodyWrapper>
          <LeftPaneWrapper>{this.renderLeftPane(mode)}</LeftPaneWrapper>
          <RightPaneWrapper>
            <RightPane mode={mode} />
          </RightPaneWrapper>
        </BodyWrapper>
      </Container>
    );
  }

  renderLeftPane = (mode: Mode) => {
    switch (mode) {
      case 'setup':
        return <LeftPaneSetup toMode={this.handleModeChange} {...this.props} />;
      case 'progress':
        return <div>{mode} mode test</div>;
      case 'overview':
        return <div>{mode} mode test</div>;
      default:
        return null;
    }
  };

  handleModeChange = (mode: Mode) => {
    this.setState({ mode });
  };
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  capacityAllocationsList: state.localNode.capacityAllocationsList,
  drive: state.localNode.drive,
  drives: state.localNode.drives,
  availableDiskSpace: state.localNode.availableDiskSpace,
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  setLocalNodeStorage,
  getDrivesList,
  getAvailableSpace,
  getFiatRate
};

LocalNode = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNode);

export default LocalNode;
