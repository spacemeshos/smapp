// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 75px;
`;

const UpperPart = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  padding: 10px 0;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
  border-bottom: ${({ theme }) => `1px solid ${theme.isDarkModeOn ? smColors.white : smColors.realBlack}`};
`;

const UpperPartLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const UpperPartRight = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`;

const Name = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
`;

type Props = {
  upperPart?: any,
  upperPartLeft: any,
  isUpperPartLeftText?: boolean,
  upperPartRight: any,
  rowName: string,
  bottomPart?: any
};

class SettingRow extends PureComponent<Props> {
  render() {
    const { upperPart, upperPartLeft, isUpperPartLeftText, upperPartRight, rowName, bottomPart } = this.props;
    return (
      <Wrapper>
        <UpperPart>
          {upperPart || (
            <>
              <UpperPartLeft>{isUpperPartLeftText ? <Text>{upperPartLeft}</Text> : upperPartLeft}</UpperPartLeft>
              {upperPartRight && <UpperPartRight>{upperPartRight}</UpperPartRight>}
            </>
          )}
        </UpperPart>
        <Name>{rowName}</Name>
        {bottomPart}
      </Wrapper>
    );
  }
}

export default SettingRow;
