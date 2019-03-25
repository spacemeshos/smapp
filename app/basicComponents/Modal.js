// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const OuterWrapper = styled.div`
  position: fixed;
  z-index: 10;
  width: 130%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${smColors.white50Alpha};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 900px;
  height: 100%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  margin: 50px auto;
  border-bottom: 1px solid ${smColors.borderGray};
  box-shadow: 0 3px 6px ${smColors.black20alpha};
`;

const HeaderWrapper = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 35px;
  font-size: 30px;
  font-weight: bold;
  line-height: 41px;
  color: ${smColors.white};
  background-color: ${smColors.green};
`;

const HeaderButtons = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeaderButton = styled.div`
  padding: 0 5px;
  margin: 0 5px;
  cursor: pointer;
`;

const CloseButton = styled(HeaderButton)`
  transform: rotate(45deg);
  font-size: 46px;
`;

const BodyWrapper = styled.div`
  background-color: ${smColors.white};
`;

type Props = {
  header: string,
  onQuestionMarkClick: () => void,
  onCloseClick: () => void,
  content: Object
};

class Modal extends Component<Props> {
  render() {
    const { header, onQuestionMarkClick, onCloseClick, content } = this.props;
    return (
      <OuterWrapper onClick={onCloseClick}>
        <Wrapper onClick={(event) => event.stopPropagation()}>
          <HeaderWrapper>
            <div>{header}</div>
            <HeaderButtons>
              <HeaderButton onClick={onQuestionMarkClick}>?</HeaderButton>
              <CloseButton onClick={onCloseClick}>+</CloseButton>
            </HeaderButtons>
          </HeaderWrapper>
          <BodyWrapper>{content}</BodyWrapper>
        </Wrapper>
      </OuterWrapper>
    );
  }
}

export default Modal;
