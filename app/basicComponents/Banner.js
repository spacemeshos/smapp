// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

// $FlowStyledIssue
const Wrapper = styled.div`
  position: absolute;
  top: ${({ top }) => top}px;
  left: calc(50% - 390px);
  width: 785px;
  height: 60px;
`;

const UpperPart = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 5px);
  height: 55px;
  background-color: ${({ color }) => color};
  z-index: 1;
`;

const LowerPart = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: calc(100% - 5px);
  height: 55px;
  border: 1px solid ${({ color }) => color};
`;

type Props = {
  children: any,
  top?: number,
  color: string
};

class Banner extends PureComponent<Props> {
  static defaultProps = {
    top: 10
  };

  render() {
    const { children, top, color } = this.props;
    return (
      <Wrapper top={top}>
        <UpperPart color={color}>{children}</UpperPart>
        <LowerPart color={color} />
      </Wrapper>
    );
  }
}

export default Banner;
