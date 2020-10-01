// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { vault } from '/assets/images';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin-bottom: 20px;
`;

const HeaderText = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const HeaderIcon = styled.img`
  width: 30px;
  height: 29px;
  margin: auto 0;
  margin-right: 5px;
`;

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
  };
`;

type Props = {
  currentStep: number
};

type State = {};

class VaultType extends Component<Props, State> {
  render() {
    const { currentStep } = this.props;

    if (currentStep !== 2) {
      return null;
    }

    return (
      <>
        <Header>
          <HeaderIcon src={vault} />
          <HeaderText>VAULT TYPE</HeaderText>
        </Header>
        <SubHeader>
          -- <br /> Select vault type from one of the options below
        </SubHeader>
      </>
    );
  }
}

export default VaultType;
