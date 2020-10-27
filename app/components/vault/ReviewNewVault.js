// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { Tooltip } from '/basicComponents';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ isLast }) => (isLast ? `0px` : `1px solid ${isDarkModeOn ? smColors.white : smColors.darkGray10Alpha};`)};
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
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

class ReviewNewVault extends Component {
  render() {
    return (
      <>
        <DetailsRow>
          <DetailsText>Name</DetailsText>
          <GrayText>My Smart Wallet </GrayText>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextWrap>
            <DetailsText>Configuration</DetailsText>
            <Tooltip width="250" text="tooltip 1" />
          </DetailsTextWrap>
          <GrayText>2 / 3 Multi-Signature</GrayText>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextWrap>
            <DetailsText>Master Accounts</DetailsText>
            <Tooltip width="250" text="tooltip 2" />
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
          <DetailsText>Fund Vault Ammount</DetailsText>
          <GrayText>5 Smesh</GrayText>
        </DetailsRow>
        <DetailsRow isLast>
          <DetailsText>Fee</DetailsText>
          <GrayText>Up to 300 smidge (300 gas units at 1 smidge per unit)</GrayText>
        </DetailsRow>
      </>
    );
  }
}

export default ReviewNewVault;
