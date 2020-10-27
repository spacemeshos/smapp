// @flow
import React from 'react';
import { CorneredContainer } from '/components/common';
import styled from 'styled-components';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const color = isDarkModeOn ? smColors.white : smColors.black;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${smColors.black80Alpha2};
  z-index: 2;
`;

const Indicator = styled.div`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({ indColor }) => indColor};
`;

type Props = {
  header: string,
  subHeader: string,
  width?: number,
  height?: number,
  headerColor?: boolean,
  children: React.node
};

const Modal = ({ header, subHeader, headerColor, children, width = 520, height = 310 }: Props) => (
  <Wrapper>
    <CorneredContainer width={width} height={height} header={header} subHeader={subHeader} headerColor={headerColor}>
      <Indicator indColor={headerColor || color} />
      {children}
    </CorneredContainer>
  </Wrapper>
);

export default Modal;
