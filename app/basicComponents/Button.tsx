import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const GAP = 4;

const LowerPart = styled.div<{
  width: number;
  height: number;
  isContainerFullWidth: boolean;
  isDisabled: boolean;
  isPrimary: boolean;
}>`
  position: absolute;
  z-index: 0;
  top: ${GAP}px;
  bottom: 0;
  left: 0;
  right: ${GAP}px;
  width: ${({ width }) => width}px;
  ${({ isContainerFullWidth }) =>
    isContainerFullWidth &&
    `
    width: 100%;
  `}
  height: ${({ height }) => height}px;
  ${({
    isDisabled,
    isPrimary,
    theme: {
      box: { radius },
      button: {
        primary: {
          settings: { hasBorder: hasPrimaryBorder },
          state: {
            base: basePrimary,
            hover: hoverPrimary,
            inactive: inactivePrimary,
          },
        },
        secondary: {
          settings: { hasBorder: hasSecondaryBorder },
          state: {
            base: baseSecondary,
            hover: hoverSecondary,
            inactive: inactiveSecondary,
          },
        },
      },
    },
  }) =>
    isDisabled
      ? `border: ${
          isPrimary
            ? hasPrimaryBorder && `1px solid ${inactivePrimary}`
            : hasSecondaryBorder && `1px solid ${inactiveSecondary}`
        };`
      : `
        border: ${
          isPrimary
            ? hasPrimaryBorder && `1px solid ${basePrimary}`
            : hasSecondaryBorder && `1px solid ${baseSecondary}`
        };
        &:hover {
          border: ${
            isPrimary
              ? hasPrimaryBorder && `1px solid ${hoverPrimary}`
              : hasSecondaryBorder && `1px solid ${hoverSecondary}`
          };
        }
        border-radius: ${
          isPrimary ? hasPrimaryBorder && radius : hasSecondaryBorder && radius
        }
      `}
  cursor: inherit;
`;

const UpperPart = styled.div<{
  width: number;
  height: number;
  isContainerFullWidth: boolean;
  isDisabled: boolean;
  isPrimary: boolean;
}>`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: ${GAP}px;
  left: ${GAP}px;
  right: 0;
  display: flex;
  flex-direction: row;
  width: ${({ width }) => width}px;
  ${({ isContainerFullWidth }) =>
    isContainerFullWidth &&
    `
    width: 100%;
  `}
  height: ${({ height }) => height}px;
  ${({
    isDisabled,
    isPrimary,
    theme: {
      button: {
        primary: {
          state: {
            base: basePrimary,
            hover: hoverPrimary,
            inactive: inactivePrimary,
          },
        },
        secondary: {
          state: {
            base: baseSecondary,
            hover: hoverSecondary,
            inactive: inactiveSecondary,
          },
        },
      },
    },
  }) =>
    isDisabled
      ? `background-color: ${isPrimary ? inactivePrimary : inactiveSecondary};`
      : `background-color: ${isPrimary ? basePrimary : baseSecondary};
        &:hover {
          background-color: ${isPrimary ? hoverPrimary : hoverSecondary};
        }
        &:hover ${LowerPart} {
          border-color: ${isPrimary ? hoverPrimary : hoverSecondary};
        }
      `}
  ${({
    isDisabled,
    isPrimary,
    theme: {
      button: {
        primary: {
          settings: { hasBorder: hasPrimaryBorder },
          state: { hover: hoverPrimary },
        },
        secondary: {
          settings: { hasBorder: hasSecondaryBorder },
          state: { hover: hoverSecondary },
        },
      },
    },
  }) =>
    !isDisabled &&
    `
    &:hover {
          border: ${
            isPrimary
              ? hasPrimaryBorder && `1px solid ${hoverPrimary}`
              : hasSecondaryBorder && `1px solid ${hoverSecondary}`
          };
        } 
    &:active {
          border: none;
        }        
      `}

  ${({
    isPrimary,
    theme: {
      button: {
        primary: { boxRadius: primaryBoxRadius },
        secondary: { boxRadius: secondaryBoxRadius },
      },
    },
  }) => `
  border-radius: ${isPrimary ? primaryBoxRadius : secondaryBoxRadius}px;`}
  cursor: inherit;
`;

const Text = styled.div<{
  height: number;
  isPrimary: boolean;
  hasImg: boolean;
  isSmallSize: boolean;
}>`
  padding-left: ${({
    isPrimary,
    hasImg,
    isSmallSize,
    theme: {
      button: { primary, secondary },
    },
  }) => {
    if (hasImg) {
      return '0';
    }

    if (isSmallSize) {
      return '17px';
    }

    return isPrimary ? primary.padding.left : secondary.padding.left;
  }};
  font-size: 12px;
  line-height: ${({ height }) => height}px;
  color: ${smColors.white};
  cursor: inherit;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 100%;
  margin: 0 10px;
  cursor: inherit;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  cursor: inherit;
`;

const Wrapper = styled.div<{
  onClick: (e?: React.MouseEvent) => void;
  width: number;
  height: number;
  isContainerFullWidth: boolean;
  isDisabled: boolean;
  style: any;
  isPrimary: boolean;
}>`
  position: relative;
  width: ${({ width }) => width + GAP}px;
  ${({ isContainerFullWidth }) =>
    isContainerFullWidth &&
    `
    width: 100%;
  `}
  height: ${({ height }) => height + GAP}px;
  ${({
    isDisabled,
    isPrimary,
    theme: {
      themeName,
      button: {
        primary: {
          settings: { hasBorder: hasPrimaryBorder },
          state: { focus: bgFocusPrimary },
        },
        secondary: {
          settings: { hasBorder: hasSecondaryBorder },
          state: { focus: bgFocusSecondary },
        },
      },
    },
  }) =>
    !isDisabled &&
    `
    &:active ${UpperPart} {
      transform: translate3d(-${themeName !== 'modern' ? GAP : 0}px, ${
      themeName !== 'modern' ? GAP : 0
    }px, 0);
      transition: transform 0.2s cubic-bezier;
      background-color: ${isPrimary ? bgFocusPrimary : bgFocusSecondary};
    }
    &:active ${LowerPart} {
      border: ${
        isPrimary
          ? hasPrimaryBorder && ` 1px solid ${bgFocusPrimary}`
          : hasSecondaryBorder && ` 1px solid ${bgFocusSecondary}`
      };
      }
    `}
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
`;

type Props = {
  onClick: (e?: React.MouseEvent) => void;
  isPrimary?: boolean;
  isDisabled?: boolean;
  isContainerFullWidth?: boolean;
  width?: number;
  height?: number;
  text: string;
  img?: string;
  imgPosition?: 'before' | 'after';
  style?: any;
};

const Button = ({
  onClick,
  isPrimary = true,
  isDisabled = false,
  width = 100,
  height = 40,
  text,
  img,
  imgPosition,
  style = {},
  isContainerFullWidth = false,
}: Props) => (
  <Wrapper
    onClick={isDisabled ? () => {} : onClick}
    width={width}
    height={height}
    isDisabled={isDisabled}
    isContainerFullWidth={isContainerFullWidth}
    style={style}
    isPrimary={isPrimary}
  >
    <UpperPart
      width={width}
      height={height}
      isPrimary={isPrimary}
      isContainerFullWidth={isContainerFullWidth}
      isDisabled={isDisabled}
    >
      {img && imgPosition === 'before' && (
        <ImageWrapper>
          <Image src={img} />
        </ImageWrapper>
      )}
      <Text
        isPrimary={isPrimary}
        hasImg={imgPosition === 'before'}
        height={height}
        isSmallSize={text.length <= 7}
      >
        {text}
      </Text>
      {img && imgPosition === 'after' && (
        <ImageWrapper>
          <Image src={img} />
        </ImageWrapper>
      )}
    </UpperPart>
    <LowerPart
      width={width}
      height={height}
      isPrimary={isPrimary}
      isContainerFullWidth={isContainerFullWidth}
      isDisabled={isDisabled}
    />
  </Wrapper>
);

export default Button;
