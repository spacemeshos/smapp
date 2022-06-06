import React from 'react';
import styled from 'styled-components';
import {
  topLeftCorner,
  topRightCorner,
  bottomLeftCorner,
  bottomRightCorner,
  topLeftCornerWhite,
  topRightCornerWhite,
  bottomLeftCornerWhite,
  bottomRightCornerWhite,
} from '../../assets/images';
import smColors from '../../vars/colors';

const Wrapper = styled.div<{ ref: any }>`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 30px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const SubHeader = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
  margin-bottom: 20px;
`;

type Props = {
  title: string;
  refProp: any;
  children: any;
  isDarkMode: boolean;
};

const SettingsSection = ({ refProp, title, children, isDarkMode }: Props) => {
  const topLeft = isDarkMode ? topLeftCornerWhite : topLeftCorner;
  const topRight = isDarkMode ? topRightCornerWhite : topRightCorner;
  const bottomLeft = isDarkMode ? bottomLeftCornerWhite : bottomLeftCorner;
  const bottomRight = isDarkMode ? bottomRightCornerWhite : bottomRightCorner;
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
};

export default SettingsSection;
