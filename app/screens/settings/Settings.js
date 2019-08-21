// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateWalletMeta, updateAccount, createNewAccount } from '/redux/wallet/actions';
import { setNodeIpAddress } from '/redux/node/actions';
import { SettingsSection, SettingRow, ChangePassphrase, SideMenu } from '/components/settings';
import { Input, Link, Button } from '/basicComponents';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { fileSystemService } from '/infra/fileSystemService';
import { autoStartService } from '/infra/autoStartService';
import { smallHorizontalSideBar } from '/assets/images';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { WalletMeta, Account, Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 80%;
`;

const AllSettingsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const HorizontalBar = styled.img`
  position: absolute;
  top: -25px;
  right: 0;
  width: 70px;
  height: 15px;
`;

const AllSettingsInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  overflow-x: hidden;
  overflow-y: visible;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
`;

type Props = {
  meta: WalletMeta,
  accounts: Account[],
  walletFiles: Array<string>,
  updateWalletMeta: Action,
  updateAccount: Action,
  createNewAccount: Action,
  setNodeIpAddress: Action,
  history: RouterHistory,
  nodeIpAddress: string
};

type State = {
  walletDisplayName: string,
  canEditDisplayName: boolean,
  isAutoStartEnabled: boolean,
  editedAccountIndex: number,
  accountDisplayNames: Array<string>,
  nodeIp: string,
  currentSettingIndex: number
};

class Settings extends Component<Props, State> {
  myRef1: any;

  myRef2: any;

  myRef3: any;

  constructor(props) {
    super(props);
    const {
      meta: { displayName },
      accounts,
      nodeIpAddress
    } = props;
    const accountDisplayNames = accounts.map((account) => account.displayName);
    this.state = {
      walletDisplayName: displayName,
      canEditDisplayName: false,
      isAutoStartEnabled: autoStartService.isAutoStartEnabled(),
      editedAccountIndex: -1,
      accountDisplayNames,
      nodeIp: nodeIpAddress,
      currentSettingIndex: 0
    };

    this.myRef1 = React.createRef();
    this.myRef2 = React.createRef();
    this.myRef3 = React.createRef();
  }

  // TODO: add last backup time
  render() {
    const { accounts, createNewAccount, setNodeIpAddress } = this.props;
    const { walletDisplayName, canEditDisplayName, isAutoStartEnabled, accountDisplayNames, editedAccountIndex, nodeIp, currentSettingIndex } = this.state;
    return (
      <Wrapper>
        <SideMenu items={['WALLET SETTINGS', 'ACCOUNTS SETTINGS', 'ADVANCED SETTINGS']} currentItem={currentSettingIndex} onClick={this.scrollToRef} />
        <AllSettingsWrapper>
          <HorizontalBar src={smallHorizontalSideBar} />
          <AllSettingsInnerWrapper>
            <SettingsSection title="WALLET SETTINGS" refProp={this.myRef1}>
              <SettingRow
                upperPartLeft={<Input value={walletDisplayName} onChange={this.editWalletDisplayName} isDisabled={!canEditDisplayName} maxLength="100" />}
                upperPartRight={
                  canEditDisplayName ? (
                    [
                      <Link onClick={this.saveEditedWalletDisplayName} text="SAVE" style={{ marginRight: 15 }} key="save" />,
                      <Link onClick={this.cancelEditingWalletDisplayName} text="CANCEL" style={{ color: smColors.darkGray }} key="cancel" />
                    ]
                  ) : (
                    <Link onClick={this.startEditingWalletDisplayName} text="EDIT" />
                  )
                }
                rowName="Display name"
              />
              <SettingRow upperPart={<ChangePassphrase />} rowName="Change passphrase" />
              <SettingRow
                upperPartLeft="Last Backup at 08.14.19"
                isUpperPartLeftText
                upperPartRight={<Link onClick={this.navigateToWalletBackup} text="BACKUP NOW" />}
                rowName="Wallet Backup"
              />
              <SettingRow
                upperPartLeft="Restore wallet from file or mnemonic phrase"
                isUpperPartLeftText
                upperPartRight={<Link onClick={this.navigateToWalletRestore} text="RESTORE" />}
                rowName="Wallet Restore"
              />
              <SettingRow
                upperPartLeft={`Auto start is ${isAutoStartEnabled ? 'ON' : 'OFF'}`}
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.toggleAutoStart} text="TOGGLE AUTO START" width={180} />}
                rowName="Wallet Auto Start"
              />
              <SettingRow
                upperPartLeft="Use at your own risk!"
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.deleteWallet} text="DELETE WALLET" width={180} />}
                rowName="Delete Wallet"
              />
              <SettingRow
                upperPart={[
                  <Text key={1}>Read about the&nbsp;</Text>,
                  <Link onClick={() => this.externalNavigation({ to: 'privacy' })} text="privacy" key={2} />,
                  <Text key={3}>,&nbsp;</Text>,
                  <Link onClick={() => this.externalNavigation({ to: 'security' })} text="security" key={4} />,
                  <Text key={5}>, of your personal information, our&nbsp;</Text>,
                  <Link onClick={() => this.externalNavigation({ to: 'terms' })} text="terms" key={6} />,
                  <Text key={7}>&nbsp;and&nbsp;</Text>,
                  <Link onClick={() => this.externalNavigation({ to: 'serviceAgreement' })} text="service agreement" key={8} />
                ]}
                rowName="Privacy, Security, Terms and Service Agreement"
              />
              <SettingRow
                upperPartLeft="Learn more in our extensive user guide"
                isUpperPartLeftText
                upperPartRight={<Link onClick={() => this.externalNavigation({ to: 'userGuide' })} text="GUIDE" />}
                rowName="User Guide"
              />
              <SettingRow
                upperPartLeft="Create a new wallet. You will be signed out of current wallet"
                isUpperPartLeftText
                upperPartRight={<Link onClick={() => {}} text="CREATE" isDisabled />}
                rowName="Create a new wallet"
              />
            </SettingsSection>
            <SettingsSection title="ACCOUNTS SETTINGS" refProp={this.myRef2}>
              <SettingRow
                upperPartLeft="Created account is ready for use immediately"
                isUpperPartLeftText
                upperPartRight={<Link onClick={createNewAccount} text="ADD ACCOUNT" width={180} />}
                rowName="Add a new account"
              />
              {accounts.map((account, index) => (
                <SettingRow
                  upperPartLeft={
                    <Input
                      value={accountDisplayNames[index]}
                      onChange={({ value }) => this.editAccountDisplayName({ value, index })}
                      isDisabled={editedAccountIndex !== index}
                      maxLength="100"
                    />
                  }
                  upperPartRight={
                    editedAccountIndex === index ? (
                      [
                        <Link onClick={() => this.saveEditedAccountDisplayName({ index })} text="SAVE" style={{ marginRight: 15 }} key="save" />,
                        <Link onClick={() => this.cancelEditingAccountDisplayName({ index })} text="CANCEL" style={{ color: smColors.darkGray }} key="cancel" />
                      ]
                    ) : (
                      <Link onClick={() => this.startEditingAccountDisplayName({ index })} text="EDIT" />
                    )
                  }
                  rowName={account.pk}
                  key={account.pk}
                />
              ))}
            </SettingsSection>
            <SettingsSection title="ADVANCED SETTINGS" refProp={this.myRef3}>
              <SettingRow
                upperPartLeft={<Input value={nodeIp} onChange={({ value }) => this.setState({ nodeIp: value })} />}
                upperPartRight={<Link onClick={setNodeIpAddress} text="CONNECT" isDisabled={!nodeIp || nodeIp.trim() === 0} />}
                rowName="Change Node IP Address"
              />
            </SettingsSection>
          </AllSettingsInnerWrapper>
        </AllSettingsWrapper>
      </Wrapper>
    );
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    if (props.accounts && props.accounts.length > prevState.accountDisplayNames.length) {
      const updatedAccountDisplayNames = [...prevState.accountDisplayNames];
      updatedAccountDisplayNames.push(props.accounts[props.accounts.length - 1].displayName);
      return { accountDisplayNames: updatedAccountDisplayNames };
    }
    return null;
  }

  editWalletDisplayName = ({ value }) => this.setState({ walletDisplayName: value });

  startEditingWalletDisplayName = () => this.setState({ canEditDisplayName: true });

  saveEditedWalletDisplayName = () => {
    const {
      meta: { displayName },
      updateWalletMeta
    } = this.props;
    const { walletDisplayName } = this.state;
    this.setState({ canEditDisplayName: false });
    if (!!walletDisplayName && !!walletDisplayName.trim() && walletDisplayName !== displayName) {
      updateWalletMeta({ metaFieldName: 'displayName', data: walletDisplayName });
    }
  };

  cancelEditingWalletDisplayName = () => {
    const {
      meta: { displayName }
    } = this.props;
    this.setState({ walletDisplayName: displayName, canEditDisplayName: false });
  };

  deleteWallet = async () => {
    const { walletFiles } = this.props;
    fileSystemService.deleteWalletFile({ fileName: walletFiles[0] });
  };

  updateAccountName = ({ accountIndex }) => async ({ value }: { value: string }) => {
    const { accounts, updateAccount } = this.props;
    if (!!value && !!value.trim() && value !== accounts[accountIndex].displayName) {
      await updateAccount({ accountIndex, fieldName: 'displayName', data: value });
    }
  };

  navigateToWalletBackup = () => {
    const { history } = this.props;
    history.push('/main/backup');
  };

  navigateToWalletRestore = () => {
    const { history } = this.props;
    history.push('/auth/restore');
  };

  externalNavigation = ({ to }: { to: string }) => {
    switch (to) {
      case 'userGuide': {
        shell.openExternal('https://testnet.spacemesh.io');
        break;
      }
      default:
        break;
    }
  };

  toggleAutoStart = () => {
    const { isAutoStartEnabled } = this.state;
    autoStartService.toggleAutoStart();
    this.setState({ isAutoStartEnabled: !isAutoStartEnabled });
  };

  editAccountDisplayName = ({ value, index }: { value: string, index: number }) => {
    const { accountDisplayNames } = this.state;
    const updatedAccountDisplayNames = [...accountDisplayNames];
    updatedAccountDisplayNames[index] = value;
    this.setState({ accountDisplayNames: updatedAccountDisplayNames });
  };

  saveEditedAccountDisplayName = ({ index }: { index: number }) => {
    const { updateAccount } = this.props;
    const { accountDisplayNames } = this.state;
    this.setState({ editedAccountIndex: -1 });
    updateAccount({ accountIndex: index, fieldName: 'displayName', data: accountDisplayNames[index] });
  };

  cancelEditingAccountDisplayName = ({ index }: { index: number }) => {
    const { accounts } = this.props;
    const { accountDisplayNames } = this.state;
    const updatedAccountDisplayNames = [...accountDisplayNames];
    updatedAccountDisplayNames[index] = accounts[index].displayName;
    this.setState({ editedAccountIndex: -1, accountDisplayNames: updatedAccountDisplayNames });
  };

  startEditingAccountDisplayName = ({ index }: { index: number }) => {
    const { editedAccountIndex } = this.state;
    if (editedAccountIndex !== -1) {
      this.cancelEditingAccountDisplayName({ index: editedAccountIndex });
    }
    this.setState({ editedAccountIndex: index });
  };

  scrollToRef = ({ index }) => {
    const ref = [this.myRef1, this.myRef2, this.myRef3][index];
    this.setState({ currentSettingIndex: index });
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
}

const mapStateToProps = (state) => ({
  meta: state.wallet.meta,
  accounts: state.wallet.accounts,
  walletFiles: state.wallet.walletFiles,
  nodeIpAddress: state.node.nodeIpAddress
});

const mapDispatchToProps = {
  updateWalletMeta,
  updateAccount,
  createNewAccount,
  setNodeIpAddress
};

Settings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

Settings = ScreenErrorBoundary(Settings);
export default Settings;
