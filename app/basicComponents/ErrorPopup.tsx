import React from 'react';
import styled from 'styled-components';
import { closePopup } from '../assets/images';
import { smColors } from '../vars';

const Wrapper = styled.div<{ onClick: (e?: React.MouseEvent) => void }>`
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
  font-size: 10px;
  line-height: 13px;
  color: ${smColors.white};
`;

type Props = {
  onClick: () => void;
  text: string;
  style?: any;
};

const ErrorPopup = ({ onClick, text, style = {} }: Props) => (
  <Wrapper onClick={onClick} style={style}>
    <CloseImg src={closePopup} />
    <PopupText>{text}</PopupText>
  </Wrapper>
);

export default ErrorPopup;
