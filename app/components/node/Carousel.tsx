import React, { useState } from 'react';
import styled from 'styled-components';
import { convertHashesToMiBs } from 'shared/utils';
import {
  chevronLeftBlack,
  chevronLeftGray,
  chevronRightBlack,
  chevronRightGray,
  posCpuActive,
  posCpuGrey,
  posGpuActive,
  posGpuGrey,
} from '../../assets/images';
import { smColors } from '../../vars';
import { DeviceType, PostSetupProvider } from '../../../shared/types';
import { formatWithCommas } from '../../infra/utils';

const SLIDE_WIDTH = 170;
const SLIDE_MARGIN = 15;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 170px;
`;

const Button = styled.img<{ isDisabled: boolean }>`
  width: 10px;
  height: 17px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  &:first-child {
    margin-right: 15px;
  }
  &:last-child {
    margin-left: 15px;
  }
`;

const OuterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

const InnerWrapper = styled.div<{
  slidesCount: number;
  leftSlideIndex: number;
}>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${({ slidesCount }) =>
    slidesCount * SLIDE_WIDTH + (slidesCount - 1) * SLIDE_MARGIN}px;
  height: 100%;
  transform: translate3d(
    -${({ leftSlideIndex }) => leftSlideIndex * SLIDE_WIDTH + (leftSlideIndex - 1) * SLIDE_MARGIN}px,
    0,
    0
  );
  transition: transform 0.6s linear;
`;

const SlideUpperPart = styled.div<{ isSelected: boolean }>`
  position: absolute;
  z-index: 2;
  bottom: 5px;
  right: 0;
  left: ${({ theme: { themeName } }) => (themeName === 'modern' ? 0 : 5)}px;
  top: ${({ theme: { themeName } }) => (themeName === 'modern' ? 5 : 0)}px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  width: 165px;
  height: 165px;
  padding: 10px 15px 20px;
  background-color: ${({ isSelected }) =>
    isSelected ? smColors.white : smColors.mediumGraySecond};
  cursor: inherit;
  &:hover {
    background-color: ${smColors.white};
  }
  clip-path: polygon(
    0% 0%,
    0% 0%,
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    15% 100%,
    0% 85%
  );
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
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
  background-color: ${smColors.realBlack};
  cursor: inherit;
  clip-path: polygon(
    0% 0%,
    0% 0%,
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    15% 100%,
    0% 85%
  );
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

const SlideLowerPart = styled.div<{ isSelected: boolean }>`
  position: absolute;
  z-index: 0;
  top: 5px;
  bottom: 0;
  left: 0;
  right: 5px;
  width: 165px;
  height: 165px;
  background-color: ${({ isSelected }) =>
    isSelected ? smColors.white : smColors.white};
  cursor: inherit;
  &:hover {
    background-color: ${smColors.white};
  }
  clip-path: polygon(
    0% 0%,
    0% 0%,
    0% 0%,
    100% 0%,
    100% 100%,
    0% 100%,
    15% 100%,
    0% 85%
  );
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

const SlideWrapper = styled.div`
  position: relative;
  width: 170px;
  height: 170px;
  margin-right: ${SLIDE_MARGIN}px;
  cursor: pointer;
  &:active ${SlideUpperPart} {
    transform: translate3d(
      ${({ theme: { themeName } }) =>
        themeName === 'modern' ? '0, 0, 0' : '-5px, 5px, 0'}
    );
    transition: transform 0.2s cubic-bezier;
    background-color: ${smColors.mediumGraySecond};
  }
  &:active ${SlideLowerPart} {
    background-color: ${smColors.black};
  }
  &:last-child {
    margin-right: 0;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ grow }: { grow?: boolean }) => grow && 'flex-grow: 1;'}
  cursor: inherit;
`;

const Text = styled.div`
  margin-bottom: 5px;
  font-size: 13px;
  line-height: 15px;
  color: ${smColors.darkerGray};
  cursor: inherit;
  text-transform: uppercase;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
`;

const GpuIcon = styled(Icon)`
  height: 25px;
`;

const CpuIcon = styled(Icon)``;

type Props = {
  data: PostSetupProvider[];
  selectedItemIndex: number;
  onClick: ({ index }: { index: number }) => void;
  style?: any;
};

const Carousel = ({ data, selectedItemIndex, onClick, style }: Props) => {
  const [carouselState, setCarouselState] = useState({
    leftSlideIndex: 0,
    isLeftBtnEnabled: false,
    isRightBtnEnabled: data.length > 3,
  });

  const handleSelection = ({ index }: { index: number }) => {
    onClick({ index });
  };

  const slideLeft = () => {
    const { leftSlideIndex } = carouselState;
    if (carouselState.leftSlideIndex > 0) {
      setCarouselState({
        leftSlideIndex: leftSlideIndex - 2,
        isLeftBtnEnabled: leftSlideIndex - 2 > 0,
        isRightBtnEnabled: data.length > 3,
      });
    }
  };

  const slideRight = () => {
    const { leftSlideIndex } = carouselState;
    if (leftSlideIndex + 2 < data.length - 1) {
      setCarouselState({
        leftSlideIndex: leftSlideIndex + 2,
        isLeftBtnEnabled: true,
        isRightBtnEnabled: data.length - 1 < leftSlideIndex + 2,
      });
    } else if (leftSlideIndex + 1 < data.length - 1) {
      setCarouselState({
        leftSlideIndex: leftSlideIndex + 1,
        isLeftBtnEnabled: true,
        isRightBtnEnabled: data.length - 1 < leftSlideIndex + 1,
      });
    }
  };

  return (
    <Wrapper>
      <Button
        src={
          carouselState.isLeftBtnEnabled ? chevronLeftBlack : chevronLeftGray
        }
        onClick={carouselState.isLeftBtnEnabled ? slideLeft : () => {}}
        isDisabled={!carouselState.isLeftBtnEnabled}
      />
      <OuterWrapper style={style}>
        <InnerWrapper
          leftSlideIndex={carouselState.leftSlideIndex}
          slidesCount={data.length}
        >
          {data.map((provider, index) => (
            <SlideWrapper
              onClick={() => handleSelection({ index })}
              key={provider.id}
            >
              <SlideUpperPart isSelected={selectedItemIndex === index}>
                <TextWrapper grow>
                  <Text>{provider.model}</Text>
                </TextWrapper>
                <TextWrapper>
                  <Text>
                    ~{formatWithCommas(provider.performance)} hashes/s
                  </Text>
                  <Text>
                    ~{convertHashesToMiBs(provider.performance)} MiB/s
                  </Text>
                  {/* <Text>TO SAVE DATA</Text> */}
                  {/* TODO: Return it back when estimated time will be available */}
                </TextWrapper>
                {provider.deviceType === DeviceType.DEVICE_CLASS_GPU ? (
                  <GpuIcon
                    src={
                      selectedItemIndex === index ? posGpuActive : posGpuGrey
                    }
                  />
                ) : (
                  <CpuIcon
                    src={
                      selectedItemIndex === index ? posCpuActive : posCpuGrey
                    }
                  />
                )}
              </SlideUpperPart>
              <SlideMiddlePart />
              <SlideLowerPart isSelected={selectedItemIndex === index} />
            </SlideWrapper>
          ))}
        </InnerWrapper>
      </OuterWrapper>
      <Button
        src={
          carouselState.isRightBtnEnabled ? chevronRightBlack : chevronRightGray
        }
        onClick={carouselState.isRightBtnEnabled ? slideRight : () => {}}
        isDisabled={!carouselState.isRightBtnEnabled}
      />
    </Wrapper>
  );
};

export default Carousel;
