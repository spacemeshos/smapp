// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner } from '/assets/images';

const Wrapper = styled.div`
  position: relative;
  margin: 8px;
`;

const TopLeftCorner = styled.img`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img`
  position: absolute;
  bottom: -8px;
  left: -8px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 8px;
  height: 8px;
`;

type Props = {
  children: any,
  className?: string
};

class CorneredWrapper extends PureComponent<Props> {
  render() {
    const { children, className } = this.props;
    return (
      <Wrapper className={className}>
        <TopLeftCorner src={topLeftCorner} />
        <TopRightCorner src={topRightCorner} />
        <BottomLeftCorner src={bottomLeftCorner} />
        <BottomRightCorner src={bottomRightCorner} />
        {children}
      </Wrapper>
    );
  }
}

export default CorneredWrapper;
