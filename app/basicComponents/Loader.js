// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { loader } from '/assets/images';

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
  background-color: rgba(0, 0, 0, 0.2);
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
    SMALL: 25,
    MEDIUM: 50,
    BIG: 150
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
