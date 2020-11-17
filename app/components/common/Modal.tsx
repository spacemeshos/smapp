import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { CorneredContainer } from '.';

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

const Indicator = styled.div<{ indColor: string }>`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({ indColor }) => indColor};
`;

type Props = {
  header: string;
  subHeader?: string;
  width?: number;
  height?: number;
  headerColor?: string;
  children: any;
};

const Modal = ({ header, subHeader = '', headerColor, children, width = 520, height = 310 }: Props) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const color = isDarkMode ? smColors.white : smColors.black;
  return (
    <Wrapper>
      <CorneredContainer width={width} height={height} header={header} subHeader={subHeader} headerColor={headerColor} isDarkMode={isDarkMode}>
        <Indicator indColor={headerColor || color} />
        {children}
      </CorneredContainer>
    </Wrapper>
  );
};

export default Modal;
