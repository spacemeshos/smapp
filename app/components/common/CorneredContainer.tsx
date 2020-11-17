import React from 'react';
import styled from 'styled-components';
import { CorneredWrapper } from '../../basicComponents';
import { smColors } from '../../vars';

const Wrapper = styled(CorneredWrapper)<{ width: number; height: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dmBlack2 : smColors.lightGray)};
`;

const DivWrapper = styled.div<{ width: number; height: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderIcon = styled.img<{ src: any }>`
  width: 35px;
  height: 27px;
  margin-right: 5px;
`;

const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${({ color }) => color};
`;

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

type Props = {
  children: any;
  width: number;
  height: number;
  header: string;
  headerColor?: string;
  headerIcon?: any;
  subHeader?: any;
  useEmptyWrap?: boolean;
  isDarkMode?: boolean;
};

const CorneredContainer = ({ children, width, height, header, headerColor = '', headerIcon = null, subHeader = '', useEmptyWrap = false, isDarkMode = false }: Props) => {
  const ResolvedWrapper: any = useEmptyWrap ? DivWrapper : Wrapper;
  const color = headerColor || isDarkMode ? smColors.white : smColors.realBlack;

  return (
    <ResolvedWrapper width={width} height={height}>
      {header && (
        <HeaderWrapper>
          {headerIcon && <HeaderIcon src={headerIcon} />}
          <Header color={color}>{header}</Header>
        </HeaderWrapper>
      )}
      {subHeader && (
        <SubHeader>
          --
          <br />
          {subHeader}
        </SubHeader>
      )}
      {children}
    </ResolvedWrapper>
  );
};

export default CorneredContainer;
