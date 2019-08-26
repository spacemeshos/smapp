// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${smColors.orange};
`;

const UpperPart = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 3px;
  left: 3px;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: ${smColors.white};
  &:hover {
    background-color: ${smColors.lightGray};
  }
  cursor: inherit;
`;

const BtnText = styled.div`
  font-size: 12px;
  line-height: 12px;
  color: ${smColors.orange};
  cursor: inherit;
  text-align: center;
`;

const LowerPart = styled.div`
  position: absolute;
  z-index: 0;
  top: 3px;
  bottom: 0;
  left: 0;
  right: 3px;
  width: 12px;
  height: 12px;
  border: 1px solid ${smColors.white};
  &:hover {
    border: 1px solid ${smColors.lightGray};
  }
  cursor: inherit;
`;

const ButtonWrapper = styled.div`
  position: relative;
  width: 14px;
  height: 14px;
  margin: 5px 10px 0 5px;
  &:active ${UpperPart} {
    transform: translate3d(-2px, 2px, 0);
    transition: transform 0.2s cubic-bezier;
    background-color: ${smColors.black};
  }
  &:active ${LowerPart} {
    border: 1px solid ${smColors.black};
  }
  cursor: pointer;
`;

const PopupText = styled.div`
  margin: 15px 15px 15px 0;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
`;

type Props = {
  onClick: () => void,
  text: string,
  style?: Object
};

class ErrorPopup extends PureComponent<Props> {
  render() {
    const { onClick, text, style } = this.props;
    return (
      <Wrapper onClick={onClick} style={style}>
        <ButtonWrapper>
          <UpperPart>
            <BtnText>X</BtnText>
          </UpperPart>
          <LowerPart />
        </ButtonWrapper>
        <PopupText>{text}</PopupText>
      </Wrapper>
    );
  }
}

export default ErrorPopup;
