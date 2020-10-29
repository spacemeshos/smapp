// @flow
import React from 'react';
import { connect } from 'react-redux';
import { CorneredContainer } from '/components/common';
import styled from 'styled-components';
import { smColors } from '/vars';

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
  isDarkModeOn: boolean,
  children: React.node
};

const Modal = ({ header, subHeader, headerColor, children, isDarkModeOn, width = 520, height = 310 }: Props) => {
  const color = isDarkModeOn ? smColors.white : smColors.black;
  return (
    <Wrapper>
      <CorneredContainer width={width} height={height} header={header} subHeader={subHeader} headerColor={headerColor} isDarkModeOn={isDarkModeOn}>
        <Indicator indColor={headerColor || color} />
        {children}
      </CorneredContainer>
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

export default connect(mapStateToProps, null)(Modal);
