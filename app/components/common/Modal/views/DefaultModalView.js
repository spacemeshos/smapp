// @flow
import React, { Component } from 'react';
import { Button, Link } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin: 30px 0 5px 0;
`;

const RightButton = styled.div`
  display: flex;
  align-items: flex-end;
`;

type Props = {
  guideLinkText?: string,
  guideLinkHandler?: () => void,
  cancelLinkHandler: () => void,
  nextButtonIsDisabled: boolean,
  nextButtonClickHandler: () => void,
  children: React.node
};

class DefaultModalView extends Component<Props, State> {
  render() {
    const { cancelLinkHandler, guideLinkHandler, guideLinkText, nextButtonClickHandler, nextButtonIsDisabled, children } = this.props;
    return (
      <>
        {children}
        <ButtonsWrapper>
          {guideLinkText && <Link onClick={guideLinkHandler} text={guideLinkText} />}
          <RightButton>
            <Link style={{ color: smColors.orange, marginRight: '10px' }} onClick={cancelLinkHandler} text="CANCEL" />
            <Button text="NEXT" isDisabled={nextButtonIsDisabled} onClick={nextButtonClickHandler} />
          </RightButton>
        </ButtonsWrapper>
      </>
    );
  }
}

export default DefaultModalView;
