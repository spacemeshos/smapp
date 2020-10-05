// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { NewVault, VaultType, VaultMasterAccount } from '/components/vault';
import { smColors } from '/vars';
import styled from 'styled-components';
import Link from '/basicComponents/Link';
import Button from '/basicComponents/Button';

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
  mode: 1 | 2 | 3 | 4 | 5 | 6,
  currentStep: number
};

class Vault extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: 1,
      name: '',
      type: 'single',
      masterAccountIndex: 0
    };
    this.handleNext = this.handleNext.bind(this);
  }

  render() {
    const { mode, name } = this.state;
    return (
      <Wrapper>
        {this.renderVaultSteps(mode)}
        <Footer>
          <Link onClick={this.navigateToVaultSetup} text="VAULT SETUP GIDE" />
          <Button text="NEXT" onClick={this.handleNext} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />
        </Footer>
      </Wrapper>
    );
  }

  renderVaultSteps = (mode) => {
    const { name, type, masterAccountIndex } = this.state;
    switch (mode) {
      case 1: {
        return <NewVault vaultName={name} onChangeVaultName={this.handleChangeVaultName} />;
      }
      case 2: {
        return <VaultType handleChangeType={this.handleChangeType} type={type} />;
      }
      case 3: {
        return <VaultMasterAccount masterAccountIndex={masterAccountIndex} selectedAccountIndex={this.selectedAccountIndex} />;
      }
      case 4: {
        return <VaultType />;
      }
      default: {
        return null;
      }
    }
  };

  handleChangeVaultName = ({ value }: { value: string }) => this.setState({ name: value });

  handleChangeType = ({ value }: { value: string }) => this.setState({ type: value });

  handleNext = () => {
    const { mode } = this.state;
    this.setState({
      mode: mode + 1
    });
  };

  selectedAccountIndex = ({ index }: { index: number }) => this.setState({ masterAccountIndex: index });

  navigateToVaultSetup = () => shell.openExternal('https://product.spacemesh.io/#/smapp_vaults');
}

export default Vault;
