import React from 'react';
import styled from 'styled-components';

const LogoImg = styled.img.attrs(({ theme: { icons: { logo } } }) => ({
  src: logo,
}))`
  position: absolute;
  top: 5px;
  left: 15px;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

const Logo = () => (
  <LogoImg onClick={() => window.open('https://spacemesh.io')} />
);

export default Logo;
