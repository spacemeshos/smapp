import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const GAP = 3;

const LowerPart = styled.div<{
  width: number;
  height: number;
  isDisabled: boolean;
  isPrimary: boolean;
  bgColor: string;
}>`
  position: absolute;
  z-index: 0;
  top: ${GAP}px;
  bottom: 0;
  left: 0;
  right: ${GAP}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  ${({
    isDisabled,
    isPrimary,
    bgColor,
    theme: {
      button: {
        secondary: {
          settings: { hasBorder },
        },
      },
    },
  }) =>
    isDisabled
      ? hasBorder && `border: 1px solid ${smColors.disabledGray};`
      : hasBorder &&
        `
        border: 1px solid ${isPrimary ? smColors.purple : bgColor};
        &:hover {
          border: 1px solid ${smColors.darkerPurple};
        }
  `}
  cursor: inherit;
`;

const UpperPart = styled.div<{
  width: number;
  height: number;
  isDisabled: boolean;
  isPrimary: boolean;
  bgColor: string;
}>`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: ${GAP}px;
  left: ${GAP}px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ width }) => width}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  ${({ isDisabled, isPrimary, bgColor }) =>
    isDisabled
      ? `background-color: ${smColors.disabledGray};`
      : `background-color: ${isPrimary ? smColors.purple : bgColor};
         &:hover {
           background-color: ${smColors.darkerPurple};
         }
      `}

  ${({
    isDisabled,
    theme: {
      button: {
        secondary: {
          settings: { hasBorder },
        },
      },
    },
  }) =>
    !isDisabled &&
    hasBorder &&
    `
        &:hover + ${LowerPart} {
          border: 1px solid ${smColors.darkerPurple};
         }
        &:active + ${LowerPart} {
          border: none;
        }
    `}
  cursor: inherit;
  ${({
    theme: {
      button: {
        secondary: { boxRadius },
      },
    },
  }) => `border-radius: ${boxRadius}px`}
`;

const Image = styled.img<{ imgWidth: number; imgHeight: number }>`
  width: ${({ imgWidth }) => imgWidth}px;
  height: ${({ imgHeight }) => imgHeight}px;
  cursor: inherit;
`;

const Wrapper = styled.div<{
  onClick: (e?: React.MouseEvent) => void;
  width: number;
  height: number;
  isDisabled: boolean;
  bgColor: string;
}>`
  position: relative;
  width: ${({ width }) => width + GAP}px;
  height: ${({ height }) => height + GAP}px;
  ${({
    isDisabled,
    bgColor,
    theme: {
      button: {
        secondary: {
          settings: { hasBorder },
        },
      },
    },
  }) =>
    !isDisabled &&
    hasBorder &&
    `
    &:active ${UpperPart} {
      transform: translate3d(-${GAP}px, ${GAP}px, 0);
      transition: transform 0.2s cubic-bezier;
      }
    &:active ${LowerPart} {
      border: 1px solid ${bgColor};
    }
    `}
  ${({ isDisabled, bgColor }) =>
    !isDisabled &&
    `
    &:active ${UpperPart} {
      background-color: ${bgColor};
    }
    `}
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onClick: (e?: React.MouseEvent) => void;
  width?: number;
  height?: number;
  isPrimary?: boolean;
  isDisabled?: boolean;
  imgWidth: number;
  imgHeight: number;
  img: string;
  bgColor?: string;
  style?: any;
};

const SecondaryButton = ({
  onClick,
  width = 25,
  height = 25,
  isPrimary = true,
  isDisabled = false,
  imgWidth,
  imgHeight,
  img,
  style = {},
  bgColor = smColors.black,
}: Props) => (
  <Wrapper
    onClick={isDisabled ? () => {} : onClick}
    width={width}
    height={height}
    isDisabled={isDisabled}
    style={style}
    bgColor={bgColor}
  >
    <UpperPart
      isPrimary={isPrimary}
      width={width}
      height={height}
      isDisabled={isDisabled}
      bgColor={bgColor}
    >
      <Image src={img} imgWidth={imgWidth} imgHeight={imgHeight} />
    </UpperPart>
    <LowerPart
      isPrimary={isPrimary}
      width={width}
      height={height}
      isDisabled={isDisabled}
      bgColor={bgColor}
    />
  </Wrapper>
);

export default SecondaryButton;
