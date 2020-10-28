// @flow
import React from 'react';
import styled from 'styled-components';
import { sidePanelRightLong, sidePanelRightLongWhite, sidePanelLeftLong, sidePanelLeftLongWhite } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dMBlack1 : smColors.black10Alpha)};
`;

const SideBar = styled.img`
  display: block;
  width: 16px;
  height: 100%;
`;

const MainWrapperInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 15px;
  width: calc(100% - 56px);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderIcon = styled.img`
  width: 35px;
  height: 27px;
  margin-right: 5px;
`;

const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.Black)};
`;

type Props = {
  header: string,
  subHeader?: string,
  headerIcon?: string,
  width: number,
  height?: number | string,
  children: any,
  style?: Object,
  isDarkModeOn?: boolean
};

const WrapperWith2SideBars = ({ width, height = '100%', header, headerIcon, subHeader, children, style, isDarkModeOn }: Props) => {
const leftImg = isDarkModeOn ? sidePanelLeftLongWhite : sidePanelLeftLong;
const rightImg = isDarkModeOn ? sidePanelRightLongWhite : sidePanelRightLong;

return (
  <Wrapper width={width} height={height} style={style}>
    <SideBar src={leftImg} />
    <MainWrapperInner>
      <HeaderWrapper>
        {headerIcon && <HeaderIcon src={headerIcon} />}
        <Header>{header}</Header>
      </HeaderWrapper>
      <SubHeader>--</SubHeader>
      {subHeader && (
        <SubHeader>
          {subHeader}
          <br />
          <br />
        </SubHeader>
      )}
      {children}
    </MainWrapperInner>
    <SideBar src={rightImg} />
  </Wrapper>
)
};

export default WrapperWith2SideBars;
