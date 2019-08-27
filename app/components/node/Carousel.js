// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { chevronLeftBlack, chevronRightBlack, chevronLeftGray, chevronRightGray } from '/assets/images';
import { smColors } from '/vars';

const SLIDE_WIDTH = 170;
const SLIDE_MARGIN = 15;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 170px;
`;

const Button = styled.img`
  width: 10px;
  height: 17px;
  margin: 0 15px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: ${({ slidesCount }) => slidesCount * SLIDE_WIDTH + (slidesCount - 1) * SLIDE_MARGIN}px;
  height: 100%;
  transform: translate3d(-${({ leftSlideIndex }) => leftSlideIndex * SLIDE_WIDTH + (leftSlideIndex - 1) * SLIDE_MARGIN}px, 0, 0);
  transition: transform 0.6s linear;
`;

const SlideUpperPart = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 5px;
  left: 5px;
  right: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  width: 165px;
  height: 165px;
  padding: 10px 15px 20px;
  background-color: ${({ isSelected }) => (isSelected ? smColors.realBlack : smColors.darkGray)};
  cursor: inherit;
  &:hover {
    background-color: ${smColors.realBlack};
  }
  clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 100%, 0% 85%);
`;

const SlideMiddlePart = styled.div`
  position: absolute;
  z-index: 1;
  top: 6px;
  bottom: 1px;
  left: 1px;
  right: 6px;
  width: 163px;
  height: 163px;
  background-color: ${smColors.white};
  cursor: inherit;
  clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 100%, 0% 85%);
`;

const SlideLowerPart = styled.div`
  position: absolute;
  z-index: 0;
  top: 5px;
  bottom: 0;
  left: 0;
  right: 5px;
  width: 165px;
  height: 165px;
  background-color: ${({ isSelected }) => (isSelected ? smColors.realBlack : smColors.darkGray)};
  cursor: inherit;
  &:hover {
    background-color: ${smColors.realBlack};
  }
  clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 100%, 0% 85%);
`;

const SlideWrapper = styled.div`
  position: relative;
  width: 170px;
  height: 170px;
  margin-right: ${SLIDE_MARGIN}px;
  cursor: pointer;
  &:active ${SlideUpperPart} {
    transform: translate3d(-5px, 5px, 0);
    transition: transform 0.2s cubic-bezier;
    background-color: ${smColors.black};
  }
  &:active ${SlideLowerPart} {
    background-color: ${smColors.black};
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  cursor: inherit;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
  cursor: inherit;
`;

type Props = {
  data: Array<{ label: string, availableDiskSpace: number }>,
  onClick: ({ index: number }) => void,
  style?: Object
};

type State = {
  selectedItemIndex: number,
  leftSlideIndex: number,
  isLeftBtnEnabled: boolean,
  isRightBtnEnabled: boolean
};

class Carousel extends Component<Props, State> {
  state = {
    selectedItemIndex: -1,
    leftSlideIndex: 0,
    isLeftBtnEnabled: false,
    isRightBtnEnabled: this.props.data.length > 3 // eslint-disable-line react/destructuring-assignment
  };

  render() {
    const { data, style } = this.props;
    const { selectedItemIndex, leftSlideIndex, isLeftBtnEnabled, isRightBtnEnabled } = this.state;
    return (
      <Wrapper>
        <Button src={isLeftBtnEnabled ? chevronLeftBlack : chevronLeftGray} onClick={isLeftBtnEnabled ? this.slideLeft : null} isDisabled={!isLeftBtnEnabled} />
        <OuterWrapper style={style}>
          <InnerWrapper leftSlideIndex={leftSlideIndex} slidesCount={data.length}>
            {data.map((element, index) => (
              <SlideWrapper onClick={() => this.handleSelection({ index })} key={element.label}>
                <SlideUpperPart isSelected={selectedItemIndex === index}>
                  <TextWrapper>
                    <Text>{element.label} hard drive</Text>
                    <Text>
                      FREE SPACE...
                      <br />
                      {element.availableDiskSpace} GB
                    </Text>
                  </TextWrapper>
                </SlideUpperPart>
                <SlideMiddlePart />
                <SlideLowerPart isSelected={selectedItemIndex === index} />
              </SlideWrapper>
            ))}
          </InnerWrapper>
        </OuterWrapper>
        <Button src={isRightBtnEnabled ? chevronRightBlack : chevronRightGray} onClick={isRightBtnEnabled ? this.slideRight : null} isDisabled={!isRightBtnEnabled} />
      </Wrapper>
    );
  }

  handleSelection = ({ index }: { index: number }) => {
    const { onClick } = this.props;
    onClick({ index });
    this.setState({ selectedItemIndex: index });
  };

  slideLeft = () => {
    const { data } = this.props;
    const { leftSlideIndex } = this.state;
    if (leftSlideIndex > 0) {
      this.setState({ leftSlideIndex: leftSlideIndex - 2, isLeftBtnEnabled: leftSlideIndex - 2 > 0, isRightBtnEnabled: data.length > 3 });
    }
  };

  slideRight = () => {
    const { data } = this.props;
    const { leftSlideIndex } = this.state;
    if (leftSlideIndex + 2 < data.length - 1) {
      this.setState({ leftSlideIndex: leftSlideIndex + 2, isLeftBtnEnabled: true, isRightBtnEnabled: data.length - 1 < leftSlideIndex + 2 });
    } else if (leftSlideIndex + 1 < data.length - 1) {
      this.setState({ leftSlideIndex: leftSlideIndex + 1, isLeftBtnEnabled: true, isRightBtnEnabled: data.length - 1 < leftSlideIndex + 1 });
    }
  };
}

export default Carousel;
