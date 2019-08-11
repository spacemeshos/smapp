import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner } from '/assets/images';

// $FlowStyledIssue
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  margin: 8px;
  padding: 20px;
  background-color: ${smColors.lightGray};
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

const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.black};
`;

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

type Props = {
  children: any,
  width: number,
  height: number,
  header: string,
  subHeader: ?string
};

class Container extends PureComponent<Props> {
  render() {
    const { children, width, height, header, subHeader } = this.props;
    return (
      <Wrapper width={width} height={height}>
        <TopLeftCorner src={topLeftCorner} />
        <TopRightCorner src={topRightCorner} />
        <BottomLeftCorner src={bottomLeftCorner} />
        <BottomRightCorner src={bottomRightCorner} />
        <Header>{header}</Header>
        <SubHeader>
          --
          <br />
          {subHeader}
        </SubHeader>
        {children}
      </Wrapper>
    );
  }
}

export default Container;
