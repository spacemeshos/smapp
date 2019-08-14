// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const GAP = 3;

// $FlowStyledIssue
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
  width: 25px;
  height: 25px;
  ${({ isDisabled, isPrimary }) =>
    isDisabled
      ? `background-color: ${smColors.disabledGray};`
      : `background-color: ${isPrimary ? smColors.purple : smColors.black};
        &:hover {
          background-color: ${smColors.darkerPurple};
        }
      `}
  cursor: inherit;
`;

// $FlowStyledIssue
const Image = styled.img`
  width: ${({ imgWidth }) => imgWidth}px;
  height: ${({ imgHeight }) => imgHeight}px;
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
  width: 25px;
  height: 25px;
  ${({ isDisabled, isPrimary }) =>
    isDisabled
      ? `border: 1px solid ${smColors.disabledGray};`
      : `
        border: 1px solid ${isPrimary ? smColors.purple : smColors.black};
        &:hover {
          border: 1px solid ${smColors.darkerPurple};
        }
      `}
  cursor: inherit;
`;

// $FlowStyledIssue
const Wrapper = styled.div`
  position: relative;
  width: ${25 + GAP}px;
  height: ${25 + GAP}px;
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
  imgWidth: number,
  imgHeight: number,
  imgName: any,
  style?: Object
};

class SecondaryButton extends PureComponent<Props> {
  static defaultProps = {
    isPrimary: true,
    isDisabled: false
  };

  render() {
    const { onClick, isPrimary, isDisabled, imgWidth, imgHeight, imgName, style } = this.props;
    return (
      <Wrapper onClick={isDisabled ? null : onClick} isDisabled={isDisabled} style={style}>
        <UpperPart isPrimary={isPrimary} isDisabled={isDisabled}>
          <Image src={imgName} imgWidth={imgWidth} imgHeight={imgHeight} />
        </UpperPart>
        <LowerPart isPrimary={isPrimary} isDisabled={isDisabled} />
      </Wrapper>
    );
  }
}

export default SecondaryButton;
