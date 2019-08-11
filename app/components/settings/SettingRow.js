// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SmButton } from '/basicComponents';
import smColors from '/vars/colors';

// $FlowStyledIssue
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid ${smColors.borderGray};
  ${({ withTopBorder }) => withTopBorder && `border-top: 1px solid ${smColors.borderGray};`}
  &: last-child {
    margin-bottom: 30px;
  }
`;

const MainText = styled.div`
  min-width: 150px;
  margin-right: 20px;
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  color: ${smColors.darkGray};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.darkGray50Alpha};
`;

const buttonStyle = { width: 200 };

type Props = {
  text: string,
  subText?: string,
  customSubText?: Array<any>,
  action?: Function,
  actionText?: string,
  customAction?: Object,
  isDisabled?: boolean,
  withTopBorder?: boolean
};

class SettingRow extends PureComponent<Props> {
  render() {
    const { text, subText, customSubText, action, actionText, customAction, isDisabled, withTopBorder } = this.props;
    return (
      <Wrapper withTopBorder={withTopBorder}>
        {subText || customSubText ? (
          <div>
            <MainText>{text}</MainText>
            <TextWrapper>{customSubText || <Text>{subText}</Text>}</TextWrapper>
          </div>
        ) : (
          <MainText>{text}</MainText>
        )}
        {customAction || (actionText && <SmButton text={actionText} onPress={action} isDisabled={isDisabled} style={buttonStyle} />)}
      </Wrapper>
    );
  }
}

export default SettingRow;
