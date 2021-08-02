import React from 'react';
import styled from 'styled-components';
import { loader, loaderWhite } from '../assets/images';
import { smColors } from '../vars';

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
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.black : smColors.background)};
  z-index: 100;
`;

const AnimatedIcon = styled.img<{ size: number }>`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

type Props = {
  size?: any;
  isDarkMode?: boolean;
};

const Loader = ({ size = 50, isDarkMode = false }: Props) => (
  <Wrapper>
    <AnimatedIcon size={size || Loader.sizes.SMALL} src={isDarkMode ? loaderWhite : loader} alt="Loading" />
  </Wrapper>
);

Loader.sizes = {
  SMALL: 50,
  MEDIUM: 250,
  BIG: 500
};

export default Loader;
