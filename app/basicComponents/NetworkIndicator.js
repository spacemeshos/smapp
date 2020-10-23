// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

const Round = styled.div`
  width: 10px;
  height: 10px;
  margin-right: 5px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

type Props = {
  color: string
};

class NetworkIndicator extends Component<Props> {
  render() {
    const { color } = this.props;
    return <Round color={color} />;
  }
}

export default NetworkIndicator;
