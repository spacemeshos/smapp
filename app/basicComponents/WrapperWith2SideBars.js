// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { rightSideBar, leftSideBar } from '/assets/images';
import { smColors } from '/vars';

// $FlowStyledIssue
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${smColors.black10Alpha};
`;

// $FlowStyledIssue
const SideBar = styled.div`
  width: 10px;
  height: 100%;
  background-image: url(${({ img }) => img});
  background-size: 10px 100%;
  background-repeat: repeat-y;
`;

const MainWrapperInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 15px;
`;

const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.black};
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

type Props = {
  header: string,
  width: number,
  height: number,
  children: any,
  style?: Object
};

class WrapperWith2SideBars extends PureComponent<Props> {
  render() {
    const { width, height, header, children, style } = this.props;
    return (
      <Wrapper width={width} height={height} style={style}>
        <SideBar img={rightSideBar} />
        <MainWrapperInner>
          <Header>{header}</Header>
          <SubHeader>--</SubHeader>
          {children}
        </MainWrapperInner>
        <SideBar img={leftSideBar} />
      </Wrapper>
    );
  }
}
export default WrapperWith2SideBars;
