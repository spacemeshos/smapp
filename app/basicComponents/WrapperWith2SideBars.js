// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { sidePanelRightLong, sidePanelRightLongWhite, sidePanelLeftLong, sidePanelLeftLongWhite } from '/assets/images';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const leftImg = isDarkModeOn ? sidePanelLeftLongWhite : sidePanelLeftLong;
const rightImg = isDarkModeOn ? sidePanelRightLongWhite : sidePanelRightLong;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${isDarkModeOn ? smColors.dMBlack1 : smColors.black10Alpha};
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

const Header = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

type Props = {
  header: string,
  subHeader?: string,
  width: number,
  height?: number | string,
  children: any,
  style?: Object
};

class WrapperWith2SideBars extends PureComponent<Props> {
  static defaultProps = {
    height: '100%'
  };

  render() {
    const { width, height, header, subHeader, children, style } = this.props;
    return (
      <Wrapper width={width} height={height} style={style}>
        <SideBar src={leftImg} />
        <MainWrapperInner>
          <Header>{header}</Header>
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
    );
  }
}
export default WrapperWith2SideBars;
