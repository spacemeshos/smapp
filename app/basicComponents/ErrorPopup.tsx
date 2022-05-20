import React from 'react';
import styled from 'styled-components';
import { closePopup } from '../assets/images';

const Wrapper = styled.div<{ onClick: (e?: React.MouseEvent) => void }>`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${({
    theme: {
      popups: {
        states: { error },
      },
    },
  }) => error.backgroundColor};
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

const CloseImg = styled.img.attrs((props) => ({
  src: props.theme.icons.closePopup,
}))`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 18px;
  cursor: pointer;
  border-radius: ${({
    theme: {
      popups: { iconRadius },
    },
  }) => iconRadius}px;
`;

const PopupText = styled.div`
  margin: 10px 10px 10px 30px;
  font-size: 10px;
  line-height: 13px;
  color: ${({
    theme: {
      popups: {
        states: { error },
      },
    },
  }) => error.color};
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
