// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { tooltip } from '/assets/images';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Wrapper = styled.div`
  width: 250px;
  display: none;
  position: absolute;
  padding: 15px 20px;
  top: -2px;
  left: 2px;
  background-color: ${smColors.lightGray};
  border: 1px solid ${smColors.white};
  z-index: 10;
`;

const ToolTipIcon = styled.img`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 13px;
  height: 13px;
`;

const Text = styled.div`
  font-size: 10px;
  line-height: 13px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

type Props = {
  className?: string,
  text: string,
  withIcon?: boolean
};

class QuestionMarkTooltip extends PureComponent<Props> {
  static defaultProps = {
    withIcon: true
  };

  render() {
    const { className, withIcon, text } = this.props;
    return (
      <Wrapper className={className}>
        {withIcon && <ToolTipIcon src={tooltip} />}
        <Text>{text}</Text>
      </Wrapper>
    );
  }
}

export default QuestionMarkTooltip;
