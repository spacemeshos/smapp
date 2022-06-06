import React from 'react';
import styled from 'styled-components';
import { CorneredWrapper, Tooltip } from '../../basicComponents';
import { smColors } from '../../vars';

const Wrapper = styled(CorneredWrapper)<{ width: number; height: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  margin-left: 8px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.lightGray};
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.vaultDarkGrey : smColors.vaultLightGrey};
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

const DivWrapper = styled.div<{ width: number; height: number }>`
  display: flex;
  position: relative;
  margin-left: 8px;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.lightGray};
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.vaultDarkGrey : smColors.vaultLightGrey};
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
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

export const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${({ color }) => color};
  text-transform: uppercase;
`;

export const SubHeader = styled.div`
  margin-bottom: auto;
  padding-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.vaultDarkGrey : smColors.vaultLightGrey};
`;

type Props = {
  children: any;
  width: number;
  height: number;
  header: string;
  tooltipMessage?: string;
  headerColor?: string;
  headerIcon?: any;
  subHeader?: any;
  useEmptyWrap?: boolean;
  isDarkMode?: boolean;
};

const CorneredContainer = ({
  children,
  width,
  height,
  header,
  tooltipMessage,
  headerColor = '',
  headerIcon = null,
  subHeader = '',
  useEmptyWrap = false,
  isDarkMode = false,
}: Props) => {
  const ResolvedWrapper: any = useEmptyWrap ? DivWrapper : Wrapper;
  const color =
    headerColor || (isDarkMode ? smColors.white : smColors.realBlack);
  return (
    <ResolvedWrapper width={width} height={height} isDarkMode={isDarkMode}>
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
          {tooltipMessage && <Tooltip text={tooltipMessage} width={200} />}
        </SubHeader>
      )}
      {children}
    </ResolvedWrapper>
  );
};

export default CorneredContainer;
