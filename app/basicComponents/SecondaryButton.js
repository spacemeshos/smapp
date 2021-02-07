// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const GAP = 3;

const UpperPart = styled.div`
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
  height: ${({ height }) => height}px;
  ${({ isDisabled, isPrimary, bgColor }) =>
    isDisabled
      ? `background-color: ${smColors.disabledGray};`
      : `background-color: ${isPrimary ? smColors.purple : bgColor};
        &:hover {
          background-color: ${smColors.darkerPurple};
        }
      `}
  cursor: inherit;
`;

const Image = styled.img`
  width: ${({ imgWidth }) => imgWidth}px;
  height: ${({ imgHeight }) => imgHeight}px;
  cursor: inherit;
`;

const LowerPart = styled.div`
  position: absolute;
  z-index: 0;
  top: ${GAP}px;
  bottom: 0;
  left: 0;
  right: ${GAP}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  ${({ isDisabled, isPrimary, bgColor }) =>
    isDisabled
      ? `border: 1px solid ${smColors.disabledGray};`
      : `
        border: 1px solid ${isPrimary ? smColors.purple : bgColor};
        &:hover {
          border: 1px solid ${smColors.darkerPurple};
        }
      `}
  cursor: inherit;
`;

const Wrapper = styled.div`
  position: relative;
  width: ${({ width }) => width + GAP}px;
  height: ${({ height }) => height + GAP}px;
  ${({ isDisabled, bgColor }) =>
    !isDisabled &&
    `
    &:active ${UpperPart} {
      transform: translate3d(-${GAP}px, ${GAP}px, 0);
      transition: transform 0.2s cubic-bezier;
      background-color: ${bgColor};
      }
    &:active ${LowerPart} {
      border: 1px solid ${bgColor};
      }
    `}
    cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onClick: Function,
  width?: number,
  height?: number,
  isPrimary?: boolean,
  isDisabled?: boolean,
  imgWidth: number,
  imgHeight: number,
  img: string,
  bgColor?: string,
  style?: Object
};

class SecondaryButton extends PureComponent<Props> {
  static defaultProps = {
    width: 25,
    height: 25,
    isPrimary: true,
    isDisabled: false,
    bgColor: smColors.black
  };

  render() {
    const { onClick, width, height, isPrimary, isDisabled, imgWidth, imgHeight, img, style, bgColor } = this.props;
    return (
      <Wrapper onClick={isDisabled ? null : onClick} width={width} height={height} isDisabled={isDisabled} style={style} bgColor={bgColor}>
        <UpperPart isPrimary={isPrimary} width={width} height={height} isDisabled={isDisabled} bgColor={bgColor}>
          <Image src={img} imgWidth={imgWidth} imgHeight={imgHeight} />
        </UpperPart>
        <LowerPart isPrimary={isPrimary} width={width} height={height} isDisabled={isDisabled} bgColor={bgColor} />
      </Wrapper>
    );
  }
}

export default SecondaryButton;
