import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
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
  z-index: 1000;
`;

const Indicator = styled.div<{ indColor?: string }>`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({
    theme: {
      indicators: { color },
    },
    indColor,
  }) => indColor || color};
`;

type Props = {
  header: string;
  subHeader?: string;
  width?: number;
  height?: number;
  headerColor?: string;
  indicatorColor?: string;
  children: any;
};

const Modal = ({
  header,
  subHeader = '',
  headerColor,
  indicatorColor,
  children,
  width = 520,
  height = 310,
}: Props) => {
  return (
    <Wrapper>
      <CorneredContainer
        width={width}
        height={height}
        header={header}
        subHeader={subHeader}
        headerColor={headerColor}
      >
        <Indicator indColor={indicatorColor || headerColor} />
        {children}
      </CorneredContainer>
    </Wrapper>
  );
};

export default Modal;
