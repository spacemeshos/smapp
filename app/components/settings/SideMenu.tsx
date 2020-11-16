import React from 'react';
import styled from 'styled-components';
import { sidePanelRightMed, sidePanelRightMedWhite, sidePanelLeftMed, sidePanelLeftMedWhite } from '../../assets/images';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 250px;
  height: 150px;
  margin-right: 15px;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dMBlack1 : smColors.black10Alpha)};
`;

const SideBar = styled.img`
  display: block;
  width: 13px;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 25px 5px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
`;

const Text = styled.div<{ isCurrent: boolean }>`
  font-size: 13px;
  line-height: 17px;
  color: ${({ isCurrent, theme }) => {
    if (!isCurrent) {
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
    } else {
      return smColors.purple;
    }
  }};
  font-family: ${({ isCurrent }) => (isCurrent ? 'SourceCodeProBold' : 'SourceCodePro')};
  text-align: right;
  cursor: pointer;
`;

const Indicator = styled.div<{ isCurrent: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 10px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.dMBlack1 : smColors.white)};
  font-size: 11px;
  background-color: ${({ isCurrent, theme }) => {
    if (isCurrent) {
      return smColors.purple;
    } else {
      return theme.isDarkMode ? smColors.white : smColors.realBlack;
    }
  }};
  cursor: pointer;
`;

type Props = {
  items: Array<string>;
  currentItem: number;
  onClick: ({ index }: { index: number }) => void;
  isDarkMode: boolean;
};

const SideMenu = ({ items, currentItem, onClick, isDarkMode }: Props) => {
  const leftImg = isDarkMode ? sidePanelLeftMedWhite : sidePanelLeftMed;
  const rightImg = isDarkMode ? sidePanelRightMedWhite : sidePanelRightMed;
  return (
    <Wrapper>
      <SideBar src={leftImg} />
      <InnerWrapper>
        {items.map((item, index) => (
          <Container onClick={() => onClick({ index })} key={index}>
            <Text isCurrent={index === currentItem}>{item}</Text>
            <Indicator isCurrent={index === currentItem}>{index + 1}</Indicator>
          </Container>
        ))}
      </InnerWrapper>
      <SideBar src={rightImg} />
    </Wrapper>
  );
};

export default SideMenu;
