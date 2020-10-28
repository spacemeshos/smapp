// @flow
import React, { Component } from 'react';
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
  background-color: ${({ hasError }) => (hasError ? smColors.orange : color)};
`;

type Props = {
  header: string,
  subHeader: string,
  width?: number,
  height?: number,
  isErrorModal?: boolean,
  isDarkModeOn: boolean,
  children: React.node
};

class Modal extends Component<Props> {
  static defaultProps = {
    width: 520,
    height: 310
  };

  render() {
    const { header, subHeader, isErrorModal, children, width, height, isDarkModeOn } = this.props;
    return (
      <Wrapper>
        <CorneredContainer width={width} height={height} header={header} subHeader={subHeader} isErrorModal={isErrorModal} isDarkModeOn={isDarkModeOn}>
          <Indicator hasError={isErrorModal} />
          {children}
        </CorneredContainer>
      </Wrapper>
    );
  }
}

export default Modal;
