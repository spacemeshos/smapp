// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const GAP = 4;

// $FlowStyledIssue
const UpperPart = styled.div`
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
  ${({ isDisabled, isPrimary }) =>
    isDisabled
      ? `background-color: ${smColors.disabledGray};`
      : `background-color: ${isPrimary ? smColors.green : smColors.purple};
        &:hover {
          background-color: ${isPrimary ? smColors.darkGreen : smColors.darkerPurple};
        }
      `}
  cursor: inherit;
`;

// $FlowStyledIssue
const Text = styled.div`
  padding-left: 7px;
  font-size: 16px;
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

// $FlowStyledIssue
const LowerPart = styled.div`
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
  ${({ isDisabled, isPrimary }) =>
    isDisabled
      ? `border: 1px solid ${smColors.disabledGray};`
      : `
        border: 1px solid ${isPrimary ? smColors.green : smColors.purple};
        &:hover {
          border: 1px solid ${isPrimary ? smColors.darkGreen : smColors.darkerPurple};
        }
      `}
  cursor: inherit;
`;

// $FlowStyledIssue
const Wrapper = styled.div`
  position: relative;
  width: ${({ width }) => width + GAP}px;
  ${({ isContainerFullWidth }) =>
    isContainerFullWidth &&
    `
    width: 100%;
  `}
  height: ${({ height }) => height + GAP}px;
  ${({ isDisabled }) =>
    !isDisabled &&
    `
    &:active ${UpperPart} {
      transform: translate3d(-${GAP}px, ${GAP}px, 0);
      transition: transform 0.2s cubic-bezier;
      background-color: ${smColors.black};
      }
    &:active ${LowerPart} {
      border: 1px solid ${smColors.black};
      }
    `}
    cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
`;

type Props = {
  onClick: Function,
  isPrimary?: boolean,
  isDisabled?: boolean,
  isContainerFullWidth?: boolean,
  width?: number,
  height?: number,
  text: string,
  img?: string,
  imgPosition?: 'before' | 'after',
  style?: Object
};

class Button extends PureComponent<Props> {
  static defaultProps = {
    isPrimary: true,
    isDisabled: false,
    width: 100,
    height: 40
  };

  render() {
    const { onClick, isPrimary, isDisabled, width, height, text, img, imgPosition, style, isContainerFullWidth } = this.props;
    return (
      <Wrapper onClick={isDisabled ? null : onClick} width={width} height={height} isDisabled={isDisabled} isContainerFullWidth={isContainerFullWidth} style={style}>
        <UpperPart width={width} height={height} isPrimary={isPrimary} isContainerFullWidth={isContainerFullWidth} isDisabled={isDisabled}>
          {img && imgPosition === 'before' && (
            <ImageWrapper>
              <Image src={img} />
            </ImageWrapper>
          )}
          <Text height={height}>{text}</Text>
          {img && imgPosition === 'after' && (
            <ImageWrapper>
              <Image src={img} />
            </ImageWrapper>
          )}
        </UpperPart>
        <LowerPart width={width} height={height} isPrimary={isPrimary} isContainerFullWidth={isContainerFullWidth} isDisabled={isDisabled} />
      </Wrapper>
    );
  }
}

export default Button;
