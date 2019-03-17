// @flow
import React, { PureComponent } from 'react';
import styled, { keyframes } from 'styled-components';
import { loader } from '/assets/images';

// $FlowStyledIssue
const Animation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

// $FlowStyledIssue
const AnimatedIcon = styled.img`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
  animation: ${Animation} 3s infinite linear;
`;

type Props = {
  size?: number
};

class Loader extends PureComponent<Props> {
  static sizes = {
    SMALL: 25,
    MEDIUM: 50,
    BIG: 150
  };

  render() {
    const { size } = this.props;
    return <AnimatedIcon size={size || Loader.sizes.SMALL} src={loader} alt="Loading" />;
  }
}

export default Loader;
