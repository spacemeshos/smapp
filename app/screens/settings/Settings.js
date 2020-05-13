// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateWalletName, updateAccountName, createNewAccount } from '/redux/wallet/actions';
import { setNodeIpAddress } from '/redux/node/actions';
import { SettingsSection, SettingRow, ChangePassword, SideMenu, EnterPasswordModal } from '/components/settings';
import { Input, Link, Button, SmallHorizontalPanel } from '/basicComponents';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { eventsService } from '/infra/eventsService';
import { walletUpdateService } from '/infra/walletUpdateService';
import { getAddress, getFormattedTimestamp } from '/infra/utils';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action } from '/types';
import { version } from '../../../package.json';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  height: 100%;
`;

const AllSettingsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
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

const GreenText = styled(Text)`
  color: ${smColors.green};
`;

type Props = {
  displayName: string,
  accounts: Account[],
  walletFiles: Array<string>,
  updateWalletName: Action,
  updateAccountName: Action,
  createNewAccount: Action,
  setNodeIpAddress: Action,
  status: Object,
  history: RouterHistory,
  nodeIpAddress: string,
  isUpdateDownloading: boolean,
  genesisTime: string,
  rewardsAddress: string,
  stateRootHash: string,
  port: string,
  networkId: string,
  backupTime: string
};

type State = {
  walletDisplayName: string,
  canEditDisplayName: boolean,
  isAutoStartEnabled: boolean,
  editedAccountIndex: number,
  accountDisplayNames: Array<string>,
  nodeIp: string,
  currentSettingIndex: number,
  shouldShowPasswordModal: boolean,
  passwordModalSubmitAction: Function,
  changedPort: string,
  isPortSet: boolean
};

class Settings extends Component<Props, State> {
  myRef1: any;

  myRef2: any;

  myRef3: any;

  myRef4: any;

  constructor(props) {
    super(props);
    const { displayName, accounts, nodeIpAddress } = props;
    const accountDisplayNames = accounts.map((account) => account.displayName);
    this.state = {
      walletDisplayName: displayName,
      canEditDisplayName: false,
      isAutoStartEnabled: eventsService.isAutoStartEnabled(),
      editedAccountIndex: -1,
      accountDisplayNames,
      nodeIp: nodeIpAddress,
      currentSettingIndex: 0,
      shouldShowPasswordModal: false,
      passwordModalSubmitAction: () => {},
      changedPort: props.port,
      isPortSet: false
    };

    this.myRef1 = React.createRef();
    this.myRef2 = React.createRef();
    this.myRef3 = React.createRef();
    this.myRef4 = React.createRef();
  }

  render() {
    const { displayName, accounts, setNodeIpAddress, status, isUpdateDownloading, genesisTime, rewardsAddress, networkId, stateRootHash, backupTime } = this.props;
    const {
      walletDisplayName,
      canEditDisplayName,
      isAutoStartEnabled,
      accountDisplayNames,
      editedAccountIndex,
      nodeIp,
      currentSettingIndex,
      shouldShowPasswordModal,
      passwordModalSubmitAction,
      changedPort,
      isPortSet
    } = this.state;
    return (
      <Wrapper>
        <SideMenu items={['WALLET SETTINGS', 'ACCOUNTS SETTINGS', 'MESH INFO', 'ADVANCED SETTINGS']} currentItem={currentSettingIndex} onClick={this.scrollToRef} />
        <AllSettingsWrapper>
          <SmallHorizontalPanel />
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
              <SettingRow upperPart={<ChangePassword />} rowName="Wallet password" />
              <SettingRow
                upperPartLeft={`Last Backup ${backupTime ? `at ${new Date(backupTime).toLocaleString()}` : 'was never backed-up.'}`}
                isUpperPartLeftText
                upperPartRight={<Link onClick={this.navigateToWalletBackup} text="BACKUP NOW" />}
                rowName="Wallet Backup"
              />
              <SettingRow
                upperPartLeft="Restore wallet from backup file or 12 words"
                isUpperPartLeftText
                upperPartRight={<Link onClick={this.navigateToWalletRestore} text="RESTORE" />}
                rowName="Wallet Restore"
              />
              <SettingRow
                upperPartLeft={`Auto start Spacemesh when your computer starts: ${isAutoStartEnabled ? 'ON' : 'OFF'}`}
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
                upperPart={[<Text key={1}>Read our&nbsp;</Text>, <Link onClick={() => this.externalNavigation({ to: 'disclaimer' })} text="disclaimer" key={2} />]}
                rowName="Legal"
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
              <SettingRow
                upperPartLeft={version}
                upperPartRight={[
                  <Text key="1" style={{ width: 170 }}>{`${isUpdateDownloading ? 'Downloading update...' : 'No updates available'}`}</Text>,
                  <Link key="2" style={{ width: 144 }} onClick={walletUpdateService.checkForWalletUpdate} text="CHECK FOR UPDATES" isDisabled />
                ]}
                rowName="App Version"
              />
            </SettingsSection>
            <SettingsSection title="ACCOUNTS SETTINGS" refProp={this.myRef2}>
              <SettingRow
                upperPartLeft={[<Text key={1}>New accounts will be added to&nbsp;</Text>, <GreenText key={2}>{displayName}</GreenText>]}
                upperPartRight={<Link onClick={this.createNewAccountWrapper} text="ADD ACCOUNT" width={180} />}
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
                  rowName={`0x${getAddress(account.publicKey)}`}
                  key={account.publicKey}
                />
              ))}
            </SettingsSection>
            <SettingsSection title="MESH INFO" refProp={this.myRef3}>
              <SettingRow upperPartLeft={genesisTime ? getFormattedTimestamp(genesisTime) : 'Smeshing not set.'} isUpperPartLeftText rowName="Genesis time" />
              <SettingRow upperPartLeft={rewardsAddress ? `0x${getAddress(rewardsAddress)}` : 'Smeshing not set.'} isUpperPartLeftText rowName="Rewards address" />
              {networkId ? <SettingRow upperPartLeft={networkId} isUpperPartLeftText rowName="Network id" /> : null}
              {status && !status.noConnection ? (
                <SettingRow upperPartLeft={`Peers: ${status.peers}. Min peers: ${status.minPeers}. Max peers: ${status.maxPeers}.`} isUpperPartLeftText rowName="Network status" />
              ) : null}
              {status && !status.noConnection ? (
                <SettingRow
                  upperPartLeft={`Synced: ${status.synced ? 'true' : 'false'}. Synced layer: ${status.syncedLayer}. Current layer: ${status.currentLayer}. Verified layer: ${
                    status.verifiedLayer
                  }.`}
                  isUpperPartLeftText
                  rowName="Sync status"
                />
              ) : null}
              {stateRootHash ? <SettingRow upperPart={stateRootHash} isUpperPartLeftText rowName="Node state root hash" /> : null}
              <SettingRow upperPartRight={<Button onClick={this.openLogFile} text="View Log" width={180} />} rowName="View log file" />
            </SettingsSection>
            <SettingsSection title="ADVANCED SETTINGS" refProp={this.myRef4}>
              <SettingRow
                upperPartLeft={
                  isPortSet ? (
                    <Text>Please restart application to apply changes</Text>
                  ) : (
                    <Input value={changedPort} onChange={({ value }) => this.setState({ changedPort: value })} maxLength="10" />
                  )
                }
                upperPartRight={<Button onClick={this.setPort} text="SET PORT" width={180} />}
                rowName="Set new TCP/UDP port for smesher. Please select port number greater than 1024"
              />
              <SettingRow
                upperPartLeft="Delete all wallets and app data, and restart it"
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.cleanAllAppDataAndSettings} text="REINSTALL" width={180} />}
                rowName="Reinstall App"
              />
              <SettingRow
                upperPartLeft={<Input value={nodeIp} onChange={({ value }) => this.setState({ nodeIp: value })} />}
                upperPartRight={<Link onClick={() => setNodeIpAddress({ nodeIpAddress: nodeIp })} text="CONNECT" isDisabled={!nodeIp || nodeIp.trim() === 0 || !status} />}
                rowName="Change Node IP Address"
              />
            </SettingsSection>
          </AllSettingsInnerWrapper>
        </AllSettingsWrapper>
        {shouldShowPasswordModal && <EnterPasswordModal submitAction={passwordModalSubmitAction} closeModal={() => this.setState({ shouldShowPasswordModal: false })} />}
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

  setPort = async () => {
    const { changedPort } = this.state;
    const parsedPort = parseInt(changedPort);
    if (parsedPort && parsedPort > 1024) {
      await eventsService.setPort({ port: changedPort });
      this.setState({ isPortSet: true });
    }
  };

  createNewAccountWrapper = () => {
    const { createNewAccount } = this.props;
    this.setState({
      shouldShowPasswordModal: true,
      passwordModalSubmitAction: ({ password }) => {
        this.setState({ shouldShowPasswordModal: false });
        createNewAccount({ password });
      }
    });
  };

  editWalletDisplayName = ({ value }) => this.setState({ walletDisplayName: value });

  startEditingWalletDisplayName = () => this.setState({ canEditDisplayName: true });

  saveEditedWalletDisplayName = () => {
    const { displayName, updateWalletName } = this.props;
    const { walletDisplayName } = this.state;
    this.setState({ canEditDisplayName: false });
    if (!!walletDisplayName && !!walletDisplayName.trim() && walletDisplayName !== displayName) {
      updateWalletName({ displayName: walletDisplayName });
    }
  };

  cancelEditingWalletDisplayName = () => {
    const { displayName } = this.props;
    this.setState({ walletDisplayName: displayName, canEditDisplayName: false });
  };

  deleteWallet = async () => {
    const { walletFiles } = this.props;
    localStorage.clear();
    await eventsService.deleteWalletFile({ fileName: walletFiles[0] });
  };

  cleanAllAppDataAndSettings = async () => {
    localStorage.clear();
    eventsService.wipeOut();
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
      case 'terms': {
        shell.openExternal('https://testnet.spacemesh.io/#/terms');
        break;
      }
      case 'disclaimer': {
        shell.openExternal('https://testnet.spacemesh.io/#/disclaimer');
        break;
      }
      case 'privacy': {
        shell.openExternal('https://testnet.spacemesh.io/#/privacy');
        break;
      }
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
    eventsService.toggleAutoStart();
    this.setState({ isAutoStartEnabled: !isAutoStartEnabled });
  };

  editAccountDisplayName = ({ value, index }: { value: string, index: number }) => {
    const { accountDisplayNames } = this.state;
    const updatedAccountDisplayNames = [...accountDisplayNames];
    updatedAccountDisplayNames[index] = value;
    this.setState({ accountDisplayNames: updatedAccountDisplayNames });
  };

  saveEditedAccountDisplayName = ({ index }: { index: number }) => {
    const { updateAccountName } = this.props;
    const { accountDisplayNames } = this.state;
    this.setState({
      shouldShowPasswordModal: true,
      passwordModalSubmitAction: ({ password }) => {
        this.setState({ editedAccountIndex: -1, shouldShowPasswordModal: false });
        updateAccountName({ accountIndex: index, name: accountDisplayNames[index], password });
      }
    });
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
    const ref = [this.myRef1, this.myRef2, this.myRef3, this.myRef4][index];
    this.setState({ currentSettingIndex: index });
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  displayName: state.wallet.meta.displayName,
  accounts: state.wallet.accounts,
  walletFiles: state.wallet.walletFiles,
  isUpdateDownloading: state.wallet.isUpdateDownloading,
  nodeIpAddress: state.node.nodeIpAddress,
  genesisTime: state.node.genesisTime,
  rewardsAddress: state.node.rewardsAddress,
  stateRootHash: state.node.stateRootHash,
  port: state.node.port,
  networkId: state.node.networkId,
  backupTime: state.wallet.backupTime
});

const mapDispatchToProps = {
  updateWalletName,
  updateAccountName,
  createNewAccount,
  setNodeIpAddress
};

Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

Settings = ScreenErrorBoundary(Settings);
export default Settings;
