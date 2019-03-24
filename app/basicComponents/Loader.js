// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { loader } from '/assets/images';

// $FlowStyledIssue
const AnimatedIcon = styled.img`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
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
