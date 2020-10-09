// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { vaultSecond, vaultSecondWhite, vault, circle, wallet } from '/assets/images';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const textColor = isDarkModeOn ? smColors.white : smColors.black;

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: end;
  color: ${textColor};
  margin-bottom: ${({ mb }) => mb}px;
`;

const LockIcon = styled.img`
  width: 65px;
  height: 65px;
  margin-right: 5px;
  margin-left: -2px;
`;

const Icon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 15px;
`;

const GreenText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 15px 0 30px 0;
  color: ${smColors.green};
`;

class VaultFinish extends Component<Props, State> {
  render() {
    return (
      <>
        <LockIcon src={isDarkModeOn ? vaultSecondWhite : vaultSecond} />
        <GreenText>Your new vault transaction has been submitted to the mesh and is being created.</GreenText>
        <DetailsRow mb={15}>
          <Icon src={circle} />
          Track creation progress in your transactions log.
        </DetailsRow>
        <DetailsRow mb={15}>
          <Icon src={wallet} />
          Your new vault will be added to in your wallet’s accounts.
        </DetailsRow>
        <DetailsRow mb={15}>
          <Icon src={vault} />
          To work with your new vault, select it from your wallet’s accounts list drop-down (left side).
        </DetailsRow>
      </>
    );
  }
}

export default VaultFinish;
