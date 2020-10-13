import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { CorneredWrapper } from '/basicComponents';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const backgroundColor = isDarkModeOn ? smColors.dmBlack2 : smColors.lightGray;
const color1 = isDarkModeOn ? smColors.white : smColors.realBlack;
const color2 = isDarkModeOn ? smColors.white : smColors.black;

const Wrapper = styled(CorneredWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  background-color: ${backgroundColor};
`;

const DivWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  padding: 20px;
  background-color: ${backgroundColor};
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
  color: ${({ color }) => color};
`;

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${color2};
`;

type Props = {
  children: any,
  width: number,
  height: number,
  header: string,
  headerIcon?: Object,
  subHeader?: string,
  hasError?: boolean,
  useEmptyWrap: boolean
};

class CorneredContainer extends PureComponent<Props> {
  render() {
    const { children, width, height, header, headerIcon, subHeader, hasError, useEmptyWrap } = this.props;

    return useEmptyWrap ? (
      <DivWrapper width={width} height={height}>
        <HeaderWrapper>
          {headerIcon && <HeaderIcon src={headerIcon} />}
          <Header color={hasError ? smColors.orange : color1}>{header}</Header>
        </HeaderWrapper>
        {subHeader && (
          <SubHeader>
            --
            <br />
            {subHeader}
          </SubHeader>
        )}
        {children}
      </DivWrapper>
    ) : (
      <Wrapper width={width} height={height}>
        <HeaderWrapper>
          {headerIcon && <HeaderIcon src={headerIcon} />}
          <Header color={hasError ? smColors.orange : color1}>{header}</Header>
        </HeaderWrapper>
        {subHeader && (
          <SubHeader>
            --
            <br />
            {subHeader}
          </SubHeader>
        )}
        {children}
      </Wrapper>
    );
  }
}

export default CorneredContainer;
