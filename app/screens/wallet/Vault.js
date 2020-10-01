// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { NewVault, VaultType } from '/components/wallet';
import { smColors } from '/vars';
import styled from 'styled-components';
import Link from '../../basicComponents/Link';
import Button from '../../basicComponents/Button';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-size: contain;
  background-color: ${isDarkModeOn ? smColors.dmBlack2 : smColors.black02Alpha};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

type Props = {};

type State = {
  currentStep: number
};

class Vault extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentStep: 1
    };
    this.handleNext = this.handleNext.bind(this);
  }

  render() {
    const { currentStep } = this.state;
    return (
      <Wrapper>
        <form onSubmit={this.handleSubmit}>
          <NewVault currentStep={currentStep} />
          <VaultType currentStep={currentStep} />
        </form>
        <Footer>
          <Link onClick={this.navigateToVaultSetup} text="VAULT SETUP GIDE" />
          <Button text="NEXT" onClick={this.handleNext} isDisabled={false} style={{ marginTop: 'auto' }} />
        </Footer>
      </Wrapper>
    );
  }

  handleSubmit() {
    return this.state;
  }

  handleNext() {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep >= 2 ? 3 : currentStep + 1
    });
  }

  navigateToVaultSetup = () => shell.openExternal('https://product.spacemesh.io/#/smapp_vaults');
}

export default Vault;
