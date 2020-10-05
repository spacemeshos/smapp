// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { NewVault, VaultType } from '/components/vault';
import styled from 'styled-components';
import { CorneredContainer } from '/components/common';
import { vault } from '/assets/images';
import { Link, Button } from '/basicComponents';

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

const headers = ['NEW VAULT', 'VAULT TYPE'];
const subHeader = ['A vault is an enhanced account with extra security and spending features.', 'Select vault’s type from one of the options below.'];

class Vault extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: 0,
      name: '',
      type: 'single'
    };
    this.handleNext = this.handleNext.bind(this);
  }

  render() {
    const { mode, name } = this.state;
    return (
      <CorneredContainer header={headers[mode]} headerIcon={vault} subHeader={subHeader[mode]} useEmptyWrap>
        {this.renderVaultSteps(mode)}
        <Footer>
          <Link onClick={this.navigateToVaultSetup} text="VAULT SETUP GIDE" />
          <Button text="NEXT" onClick={this.handleNext} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />
        </Footer>
      </CorneredContainer>
    );
  }

  renderVaultSteps = (mode) => {
    const { name, type } = this.state;
    switch (mode) {
      case 0: {
        return <NewVault vaultName={name} onChangeVaultName={this.handleChangeVaultName} />;
      }
      case 1: {
        return <VaultType handleChangeType={this.handleChangeType} type={type} />;
      }
      case 2: {
        return <VaultType handleChangeType={this.handleChangeType} type={type} />;
      }
      case 3: {
        return <VaultType handleChangeType={this.handleChangeType} type={type} />;
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

  navigateToVaultSetup = () => shell.openExternal('https://product.spacemesh.io/#/smapp_vaults');
}

export default Vault;
