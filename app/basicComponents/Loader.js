// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { loader } from '/assets/images';

// $FlowStyledIssue
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 100;
`;

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
    SMALL: 50,
    MEDIUM: 250,
    BIG: 500
  };

  render() {
    const { size } = this.props;
    return (
      <Wrapper>
        <AnimatedIcon size={size || Loader.sizes.SMALL} src={loader} alt="Loading" />
      </Wrapper>
    );
  }
}

export default Loader;
