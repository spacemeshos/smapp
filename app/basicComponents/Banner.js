// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 0 0 60px;
  position: relative;
  width: 785px;
  height: 60px;
  margin: ${({ margin }) => margin};
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
  margin?: string,
  color: string
};

class Banner extends PureComponent<Props> {
  static defaultProps = {
    margin: '0'
  };

  render() {
    const { children, margin, color } = this.props;
    return (
      <Wrapper margin={margin}>
        <UpperPart color={color}>{children}</UpperPart>
        <LowerPart color={color} />
      </Wrapper>
    );
  }
}

export default Banner;
