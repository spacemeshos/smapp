import React from 'react';
import styled from 'styled-components';
import { CorneredWrapper, Tooltip } from '../../basicComponents';

const Wrapper = styled(CorneredWrapper)<{ width: number; height: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  margin-left: 8px;
  background-color: ${({ theme }) =>
    theme.corneredContainer.wrapper.background};
  color: ${({ theme }) => theme.corneredContainer.wrapper.color};
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
    theme.corneredContainer.wrapper.background};
  color: ${({ theme }) => theme.corneredContainer.wrapper.color};
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

export const Header = styled.div<{ color?: string }>`
  font-size: 32px;
  line-height: 40px;
  color: ${({
    color: headerColor,
    theme: {
      header: { color },
    },
  }) => headerColor || color};
  text-transform: uppercase;
`;

export const SubHeader = styled.div`
  margin-bottom: auto;
  padding-bottom: 30px;
  font-size: 16px;
  line-height: 20px;
  color: ${({
    theme: {
      header: { color },
    },
  }) => color};
`;

type Props = {
  children?: any[];
  width: number;
  height: number | string;
  header: string;
  tooltipMessage?: string;
  headerColor?: string;
  headerIcon?: any;
  subHeader?: any;
  useEmptyWrap?: boolean;
};

const CorneredContainer = ({
  children,
  width,
  height,
  header,
  tooltipMessage,
  headerIcon = null,
  headerColor,
  subHeader = '',
  useEmptyWrap = false,
}: Props) => {
  type WrapperType = React.ElementType<
    React.HTMLAttributes<HTMLDivElement> & {
      width: number;
      height: number | string;
    }
  >;
  const ResolvedWrapper: WrapperType = useEmptyWrap ? DivWrapper : Wrapper;

  const parsedHeight =
    typeof height === 'string' ? parseInt(height, 10) : height;

  return (
    <ResolvedWrapper width={width} height={parsedHeight}>
      {header && (
        <HeaderWrapper>
          {headerIcon && <HeaderIcon src={headerIcon} />}
          <Header color={headerColor}>{header}</Header>
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
