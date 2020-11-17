import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { Tooltip } from '../../basicComponents';

const DetailsRow = styled.div<{ isLast?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ isLast, theme }) => (isLast ? `0px` : `1px solid ${theme.isDarkMode ? smColors.white : smColors.darkGray10Alpha};`)};
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const DetailsTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GrayText = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  color: ${smColors.dark75Alpha};
`;

type Props = {
  isDarkMode: boolean;
};

const ReviewNewVault = ({ isDarkMode }: Props) => (
  <>
    <DetailsRow>
      <DetailsText>Name</DetailsText>
      <GrayText>My Smart Wallet </GrayText>
    </DetailsRow>
    <DetailsRow>
      <DetailsTextWrap>
        <DetailsText>Configuration</DetailsText>
        <Tooltip width={250} text="tooltip 1" isDarkMode={isDarkMode} />
      </DetailsTextWrap>
      <GrayText>2 / 3 Multi-Signature</GrayText>
    </DetailsRow>
    <DetailsRow>
      <DetailsTextWrap>
        <DetailsText>Master Accounts</DetailsText>
        <Tooltip width={250} text="tooltip 2" isDarkMode={isDarkMode} />
      </DetailsTextWrap>
      <GrayText>0X1234...1234, 0X1234...1234, 0X1234...1234</GrayText>
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Daily Spending Limit</DetailsText>
      <GrayText>1 Smesh</GrayText>
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Daily Spending Account</DetailsText>
      <GrayText>0X1234...1234</GrayText>
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Create Using Account</DetailsText>
      <GrayText>My Main Account 0X1234...1234</GrayText>
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Fund Vault Amount</DetailsText>
      <GrayText>5 Smesh</GrayText>
    </DetailsRow>
    <DetailsRow isLast>
      <DetailsText>Fee</DetailsText>
      <GrayText>Up to 300 smidge (300 gas units at 1 smidge per unit)</GrayText>
    </DetailsRow>
  </>
);

export default ReviewNewVault;
