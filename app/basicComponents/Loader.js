// @flow
import React from 'react';
import styled from 'styled-components';
import { loader, loaderWhite } from '/assets/images';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const img = isDarkModeOn ? loaderWhite : loader;

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

const Loader = ({ size = Loader.sizes.SMALL }: Props) => (
  <Wrapper>
    <AnimatedIcon size={size || Loader.sizes.SMALL} src={img} alt="Loading" />
  </Wrapper>
);

Loader.sizes = {
  SMALL: 50,
  MEDIUM: 250,
  BIG: 500
};

export default Loader;
