// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

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

const LeftPane = styled.div`
  text-align: left;
  flex: 2;
  padding: 24px 0;
  margin-right: 32px;
`;

const RightPane = styled.div`
  flex: 1;
  background-color: white;
  padding: 30px;
  border: 1px solid ${smColors.borderGray};
`;

class LocalNode extends Component<{}> {
  render() {
    // TODO: set local node startup status
    const mode: 'setup' | 'progress' | 'overview' = 'setup';
    const header = `Local Node${mode !== 'overview' ? ' Setup' : ''}`;
    return (
      <Container>
        <Header>{header}</Header>
        <BodyWrapper>
          <LeftPane>Left Pane</LeftPane>
          <RightPane>Right Pane</RightPane>
        </BodyWrapper>
      </Container>
    );
  }
}

export default LocalNode;
