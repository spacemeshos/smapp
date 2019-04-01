// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors, localNodeModes } from '/vars';
import { LeftPaneSetup, LeftPane, RightPane } from '/components/localNode';

const Container = styled.div`
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

type Props = {};

type State = {
  mode: number
};

class LocalNode extends Component<Props, State> {
  state = {
    mode: localNodeModes.SETUP
  };

  render() {
    const { mode } = this.state;
    const header = `Local Node${mode !== localNodeModes.OVERVIEW ? ' Setup' : ''}`;
    return (
      <Container>
        <Header>{header}</Header>
        <BodyWrapper>
          <LeftPaneWrapper>{this.renderLeftPane(mode)}</LeftPaneWrapper>
          <RightPane mode={mode} />
        </BodyWrapper>
      </Container>
    );
  }

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

export default LocalNode;
