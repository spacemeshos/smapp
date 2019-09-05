// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { closePopup } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${smColors.orange};
`;

const CloseImg = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 18px;
  cursor: pointer;
`;

const PopupText = styled.div`
  margin: 10px 10px 10px 30px;
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
        <CloseImg src={closePopup} />
        <PopupText>{text}</PopupText>
      </Wrapper>
    );
  }
}

export default ErrorPopup;
