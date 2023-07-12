import React from 'react';
import styled from 'styled-components';
import { closePopup } from '../assets/images';

const Wrapper = styled.div<{
  onClick: (e?: React.MouseEvent) => void;
  messageType;
}>`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${({
    messageType,
    theme: {
      popups: { states },
    },
  }) => states[messageType].backgroundColor};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
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

const PopupText = styled.div<{
  messageType;
}>`
  margin: 10px 10px 10px 30px;
  font-size: 10px;
  line-height: 13px;
  color: ${({
    messageType,
    theme: {
      popups: { states },
    },
  }) => states[messageType].color};
`;

type Props = {
  onClick: () => void;
  text: string;
  style?: any;
  messageType?: 'error' | 'warning' | 'infoTooltip' | 'success';
};

const ErrorPopup = ({
  onClick,
  text,
  style = {},
  messageType = 'error',
}: Props) => (
  <Wrapper onClick={onClick} style={style} messageType={messageType}>
    <CloseImg src={closePopup} />
    <PopupText messageType={messageType}>{text}</PopupText>
  </Wrapper>
);

export default ErrorPopup;
