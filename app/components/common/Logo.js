// @flow
import { shell } from 'electron';
import React from 'react';
import styled from 'styled-components';
import { logo, logoWhite } from '/assets/images';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const logoImg = isDarkModeOn ? logoWhite : logo;

const LogoImg = styled.img`
  position: absolute;
  top: 5px;
  left: 15px;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

const Logo = () => <LogoImg src={logoImg} onClick={() => shell.openExternal('https://spacemesh.io')} />;

export default Logo;
