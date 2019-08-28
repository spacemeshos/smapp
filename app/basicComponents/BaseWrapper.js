// @flow
import React, { PureComponent } from 'react';
import { shell } from 'electron';
import styled from 'styled-components';
import { smColors } from '/vars';
import { logo, sideBar } from '/assets/images';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 30px 25px;
  background-color: ${smColors.white};
`;

const Logo = styled.img`
  display: block;
  position: absolute;
  top: 5px;
  left: 15px;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

const SideBar = styled.img`
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${smColors.white};
`;

type Props = {
  children: any
};

class BaseWrapper extends PureComponent<Props> {
  render() {
    const { children } = this.props;
    return (
      <Wrapper>
        <Logo src={logo} onClick={() => shell.openExternal('https://spacemesh.io')} />
        <SideBar src={sideBar} />
        <InnerWrapper>{children}</InnerWrapper>
      </Wrapper>
    );
  }
}

export default BaseWrapper;
