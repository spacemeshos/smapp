import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Link } from 'react-scroll';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 250px;
  height: 190px;
  margin-right: 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const SideBar = styled.img<{ isLeft: boolean }>`
  display: block;
  width: 13px;
  height: 100%;

  ${({ theme, isLeft }) => `
    border-top-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-top-right-radius: ${isLeft ? 0 : theme.box.radius}px;
    border-bottom-left-radius: ${isLeft ? theme.box.radius : 0}px;
    border-bottom-right-radius: ${isLeft ? 0 : theme.box.radius}px;
  `};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 25px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha};
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ isCurrent, theme }) => {
    if (!isCurrent) {
      return theme.color.contrast;
    } else {
      return smColors.purple;
    }
  }};
  font-weight: ${({ isCurrent }) => (isCurrent ? 400 : 800)};
  text-align: right;
  cursor: pointer;

  .active & {
    font-family: SourceCodeProBold;
    color: ${smColors.purple};
  }
`;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 10px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.white};
  font-size: 11px;
  background-color: ${({ theme }) => theme.color.contrast};
  cursor: pointer;

  .active & {
    background-color: ${smColors.purple};
  }
`;

const Container = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  ${({ theme }) => `border-radius: ${theme.indicators.radius}px;`}
`;

type Props = {
  items: Array<string>;
};

const SideMenu = ({ items }: Props) => {
  const { icons } = useTheme();
  const leftImg = icons.sidePanelLeftMed;
  const rightImg = icons.sidePanelRightMed;
  return (
    <Wrapper>
      <SideBar src={leftImg} isLeft />
      <InnerWrapper>
        {items.map((item, index) => (
          <Container
            to={item}
            activeClass="active"
            spy
            smooth
            key={item}
            containerId="settingsContainer"
          >
            <Text>{item}</Text>
            <Indicator>{index + 1}</Indicator>
          </Container>
        ))}
      </InnerWrapper>
      <SideBar src={rightImg} isLeft={false} />
    </Wrapper>
  );
};

export default SideMenu;
