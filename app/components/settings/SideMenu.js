// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { leftSideBar, rightSideBar } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 150px;
  margin-right: 15px;
  padding: 25px;
  background-color: ${smColors.black10Alpha};
`;

const LeftSideBar = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
`;

const RightSideBar = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ isCurrent }) => (!isCurrent ? smColors.realBlack : smColors.purple)};
  font-family: ${({ isCurrent }) => (isCurrent ? 'SourceCodeProBold' : 'SourceCodePro')};
  text-align: right;
  cursor: pointer;
`;

const Indicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-left: 10px;
  color: ${smColors.white};
  font-size: 11px;
  background-color: ${({ isCurrent }) => (isCurrent ? smColors.purple : smColors.realBlack)};
  cursor: pointer;
`;

type Props = {
  items: Array<string>,
  currentItem: number,
  onClick: ({ index: number }) => void
};

class SideMenu extends PureComponent<Props> {
  render() {
    const { items, currentItem, onClick } = this.props;
    return (
      <Wrapper>
        <LeftSideBar src={leftSideBar} />
        <RightSideBar src={rightSideBar} />
        {items.map((item, index) => (
          <Container onClick={() => onClick({ index })} key={index}>
            <Text isCurrent={index === currentItem}>{item}</Text>
            <Indicator isCurrent={index === currentItem}>{index + 1}</Indicator>
          </Container>
        ))}
      </Wrapper>
    );
  }
}

export default SideMenu;
