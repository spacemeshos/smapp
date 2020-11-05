// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  topLeftCorner,
  topRightCorner,
  bottomLeftCorner,
  bottomRightCorner,
  topLeftCornerWhite,
  topRightCornerWhite,
  bottomLeftCornerWhite,
  bottomRightCornerWhite
} from '/assets/images';
import smColors from '/vars/colors';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 30px;
  background-color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dmBlack2 : smColors.black02Alpha)};
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
  font-size: 42px;
  line-height: 55px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const SubHeader = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
  margin-bottom: 20px;
`;

type Props = {
  title: string,
  refProp: Object,
  children: any,
  isDarkModeOn: boolean
};

class SettingsSection extends PureComponent<Props> {
  render() {
    const { refProp, title, children, isDarkModeOn } = this.props;
    const topLeft = isDarkModeOn ? topLeftCornerWhite : topLeftCorner;
    const topRight = isDarkModeOn ? topRightCornerWhite : topRightCorner;
    const bottomLeft = isDarkModeOn ? bottomLeftCornerWhite : bottomLeftCorner;
    const bottomRight = isDarkModeOn ? bottomRightCornerWhite : bottomRightCorner;
    return (
      <Wrapper ref={refProp}>
        <Header>{title}</Header>
        <SubHeader>--</SubHeader>
        <TopLeftCorner src={topLeft} />
        <TopRightCorner src={topRight} />
        <BottomLeftCorner src={bottomLeft} />
        <BottomRightCorner src={bottomRight} />
        {children}
      </Wrapper>
    );
  }
}

export default SettingsSection;
