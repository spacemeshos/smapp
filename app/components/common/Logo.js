// @flow
import { shell } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { logo } from '/assets/images';

// $FlowStyledIssue
const LogoImg = styled.img`
  position: absolute;
  top: 5px;
  left: 15px;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

type Props = {};

class Logo extends PureComponent<Props> {
  render() {
    return <LogoImg src={logo} onClick={() => shell.openExternal('https://spacemesh.io')} />;
  }
}

export default Logo;
