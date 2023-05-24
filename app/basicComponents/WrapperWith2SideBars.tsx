import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';
import Tooltip from './Tooltip';

const Wrapper = styled.div<{ width: number; height: number | string }>`
  display: flex;
  flex-direction: row;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) =>
    typeof height === 'string' ? height : `${height}px`};
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black10Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const SideBar = styled.img.attrs<{ isLeft: boolean }>(
  ({
    theme: {
      icons: { sidePanelLeft, sidePanelRight },
    },
    isLeft,
  }) => ({
    src: isLeft ? sidePanelLeft : sidePanelRight,
  })
)<{ isLeft: boolean }>`
  display: block;
  width: 16px;
  height: 100%;
  ${({ theme, isLeft }) => `
    border-top-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-top-right-radius: ${isLeft ? 0 : theme.box.radius}px;
    border-bottom-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-bottom-right-radius: ${isLeft ? 0 : theme.box.radius}px;
  `};
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.color.contrast};
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

type Props = {
  header: string;
  subHeader?: string;
  headerIcon?: string;
  width: number;
  height?: number | string;
  children: any;
  style?: any;
  headerTooltipName?: boolean;
};

const WrapperWith2SideBars = ({
  width,
  height = '100%',
  header,
  headerIcon,
  subHeader,
  children,
  style,
  headerTooltipName,
}: Props) => {
  return (
    <Wrapper width={width} height={height} style={style}>
      <SideBar isLeft />
      <MainWrapperInner>
        <HeaderWrapper>
          {headerIcon && <HeaderIcon src={headerIcon} />}
          <Header>{header}</Header>
          {headerTooltipName && (
            <Tooltip
              affectTextCase={false}
              text={header}
              width={200}
              marginTop={-25}
            />
          )}
        </HeaderWrapper>
        <SubHeader>--</SubHeader>
        {subHeader && <SubHeader>{subHeader}</SubHeader>}
        {children}
      </MainWrapperInner>
      <SideBar isLeft={false} />
    </Wrapper>
  );
};

export default WrapperWith2SideBars;
