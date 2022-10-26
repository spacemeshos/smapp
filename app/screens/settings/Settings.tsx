import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Element, scroller } from 'react-scroll';
import {
  updateWalletName,
  createNewAccount,
  switchApiProvider,
} from '../../redux/wallet/actions';
import { setUiError, switchSkin } from '../../redux/ui/actions';
import {
  SettingsSection,
  SettingRow,
  ChangePassword,
  SideMenu,
  EnterPasswordModal,
  SignMessage,
} from '../../components/settings';
import { Input, Link, Button, DropDown } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { getFormattedTimestamp } from '../../infra/utils';
import { smColors } from '../../vars';
import { AppThDispatch, RootState } from '../../types';
import { Modal } from '../../components/common';
import { Account } from '../../../shared/types';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { ExternalLinks, LOCAL_NODE_API_URL } from '../../../shared/constants';
import { goToSwitchNetwork } from '../../routeUtils';
import { getNetworkId, getNetworkName } from '../../redux/network/selectors';
import { AuthPath, MainPath, RouterPath } from '../../routerPaths';
import { setClientSettingsTheme } from '../../theme';

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

const AllSettingsInnerWrapper = styled(Element)`
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
  color: ${({ theme: { color } }) => color.primary};
`;

const Name = styled.div`
  font-size: 14px;
  line-height: 40px;
  color: ${({ theme: { color } }) => color.primary};
  margin-left: 10px;
`;

const GreenText = styled(Text)`
  color: ${smColors.green};
`;

const AccountCmdBtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
`;

const AccountCmdBtnSeparator = styled.div`
  width: 2px;
  height: 20px;
  background-color: ${smColors.blue};
  margin: auto 15px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 30px 0 15px 0;
`;

interface Props extends RouteComponentProps {
  displayName: string;
  accounts: Account[];
  walletFiles: Array<string>;
  updateWalletName: AppThDispatch;
  createNewAccount: AppThDispatch;
  switchSkin: AppThDispatch;
  setUiError: AppThDispatch;
  switchApiProvider: AppThDispatch;
  currentWalletPath: string;
  genesisTime: number;
  rootHash: string;
  build: string;
  version: string;
  port: string;
  dataPath: string;
  backupTime: string;
  isDarkMode: boolean;
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { currentSettingIndex: string };
  };
  isWalletOnly: boolean;
  netName: string;
  netId: number;
  skinId: number;
}

type State = {
  walletDisplayName: string;
  canEditDisplayName: boolean;
  isAutoStartEnabled: boolean;
  editedAccountIndex: number;
  accountDisplayNames: Array<string>;
  showPasswordModal: boolean;
  passwordModalSubmitAction: ({ password }: { password: string }) => void;
  changedPort: string;
  isPortSet: boolean;
  signMessageModalAccountIndex: number;
  showModal: boolean;
};

const categories = ['GENERAL', 'WALLETS', 'ACCOUNTS', 'INFO', 'ADVANCED'];

class Settings extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { displayName, accounts } = props;
    const accountDisplayNames = accounts.map((account) => account.displayName);
    this.state = {
      walletDisplayName: displayName,
      canEditDisplayName: false,
      isAutoStartEnabled: false,
      editedAccountIndex: -1,
      accountDisplayNames,
      showPasswordModal: false,
      passwordModalSubmitAction: () => {},
      changedPort: props.port,
      isPortSet: false,
      signMessageModalAccountIndex: -1,
      showModal: false,
    };
  }

  render() {
    const {
      displayName,
      accounts,
      netName,
      netId,
      genesisTime,
      rootHash,
      build,
      version,
      backupTime,
      isWalletOnly,
      history,
      dataPath,
      skinId,
    } = this.props;
    const {
      walletDisplayName,
      canEditDisplayName,
      isAutoStartEnabled,
      accountDisplayNames,
      editedAccountIndex,
      showPasswordModal,
      passwordModalSubmitAction,
      changedPort,
      isPortSet,
      signMessageModalAccountIndex,
      showModal,
    } = this.state;

    return (
      <Wrapper>
        <SideMenu items={categories} />
        <AllSettingsWrapper>
          <AllSettingsInnerWrapper id="settingsContainer">
            <SettingsSection title={categories[0]} name={categories[0]}>
              <SettingRow
                upperPartLeft={
                  <DropDown
                    data={[
                      { label: 'Modern Dark' },
                      { label: 'Classic Dark' },
                      { label: 'Classic Light' },
                    ]}
                    onClick={this.setSkin}
                    selectedItemIndex={skinId}
                    rowHeight={40}
                    hideSelectedItem
                  />
                }
                rowName="Skin"
              />
              <SettingRow
                upperPartLeft={`Auto start Spacemesh when your computer starts: ${
                  isAutoStartEnabled ? 'ON' : 'OFF'
                }`}
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.toggleAutoStart}
                    text="TOGGLE AUTO START"
                    width={180}
                  />
                }
                rowName="Wallet Auto Start"
              />
              <SettingRow
                upperPart={[
                  <Text key={1}>Read our&nbsp;</Text>,
                  <Link
                    onClick={() =>
                      this.externalNavigation(ExternalLinks.Disclaimer)
                    }
                    text="disclaimer"
                    key={2}
                  />,
                ]}
                rowName="Legal"
              />
              <SettingRow
                upperPartLeft="Learn more in our extensive user guide"
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={() =>
                      this.externalNavigation(ExternalLinks.UserGuide)
                    }
                    text="GUIDE"
                    width={180}
                  />
                }
                rowName="User Guide"
              />
            </SettingsSection>
            <SettingsSection title={categories[1]} name={categories[1]}>
              {isWalletOnly ? (
                <SettingRow
                  rowName="Application mode"
                  upperPartLeft="Wallet only"
                  upperPartRight={
                    <Button
                      onClick={this.switchToLocalNode}
                      text="SWITCH TO LOCAL NODE"
                      width={180}
                    />
                  }
                />
              ) : (
                <SettingRow
                  rowName="Application mode"
                  upperPartLeft="Local node"
                  upperPartRight={
                    <Button
                      onClick={this.switchToRemoteApi}
                      text="SWITCH TO WALLET ONLY"
                      width={190}
                    />
                  }
                />
              )}
              <SettingRow
                rowName="Current network"
                upperPartLeft={`${netName} (${netId})`}
                upperPartRight={
                  <Button
                    onClick={() => goToSwitchNetwork(history, isWalletOnly)}
                    text="SWITCH NETWORK"
                    width={180}
                  />
                }
              />
              <SettingRow
                upperPartLeft={
                  canEditDisplayName ? (
                    <Input
                      value={walletDisplayName}
                      onChange={this.editWalletDisplayName}
                      maxLength="100"
                    />
                  ) : (
                    <Name>{walletDisplayName}</Name>
                  )
                }
                upperPartRight={
                  canEditDisplayName ? (
                    [
                      <Link
                        onClick={this.saveEditedWalletDisplayName}
                        text="SAVE"
                        style={{ marginRight: 15 }}
                        key="save"
                      />,
                      <Link
                        onClick={this.cancelEditingWalletDisplayName}
                        text="CANCEL"
                        style={{ color: smColors.darkGray }}
                        key="cancel"
                      />,
                    ]
                  ) : (
                    <Button
                      onClick={this.startEditingWalletDisplayName}
                      text="RENAME"
                      width={180}
                    />
                  )
                }
                rowName="Display name"
              />
              <SettingRow
                upperPart={<ChangePassword />}
                rowName="Wallet password"
              />
              <SettingRow
                upperPartLeft={`Last Backup ${
                  backupTime
                    ? `at ${new Date(backupTime).toLocaleString()}`
                    : 'was never backed-up.'
                }`}
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.navigateToWalletBackup}
                    text="BACKUP NOW"
                    width={180}
                  />
                }
                rowName="Backup wallet"
              />
              <SettingRow
                upperPartLeft="Restore wallet from backup file or 12 words"
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.navigateToWalletRestore}
                    text="RESTORE"
                    width={180}
                  />
                }
                rowName="Restore wallet"
              />
              <SettingRow
                upperPartLeft="Use at your own risk!"
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.deleteWallet}
                    text="DELETE WALLET"
                    width={180}
                  />
                }
                rowName="Delete Wallet"
              />
              <SettingRow
                rowName="Close wallet"
                upperPartLeft={walletDisplayName}
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.closeWallet}
                    text="LOG OUT"
                    width={180}
                  />
                }
              />
              <SettingRow
                rowName="Open wallet"
                upperPartLeft="You will be signed out of current wallet"
                isUpperPartLeftText
                upperPartRight={
                  <>
                    <Button
                      onClick={this.openWalletFile}
                      text="OPEN WALLET FILE"
                      width={180}
                      style={{ marginRight: '1em' }}
                    />
                    <Button
                      onClick={this.restoreFromMnemonics}
                      text="RESTORE FROM 12 WORDS"
                      width={180}
                    />
                  </>
                }
              />
              <SettingRow
                upperPartLeft="You will be signed out of current wallet"
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.createNewWallet}
                    text="CREATE"
                    width={180}
                  />
                }
                rowName="Create wallet"
              />
            </SettingsSection>
            <SettingsSection title={categories[2]} name={categories[2]}>
              <SettingRow
                upperPartLeft={[
                  <Text key={1}>New account will be added to&nbsp;</Text>,
                  <GreenText key={2}>{displayName}</GreenText>,
                ]}
                upperPartRight={
                  <Button
                    onClick={this.createNewAccountWrapper}
                    text="ADD ACCOUNT"
                    width={180}
                  />
                }
                rowName="Add a new account"
              />
              {accounts.map((account, index) => (
                <SettingRow
                  upperPartLeft={
                    editedAccountIndex !== index ? (
                      <Name>{accountDisplayNames[index]}</Name>
                    ) : (
                      <Input
                        value={accountDisplayNames[index]}
                        onChange={({ value }) =>
                          this.editAccountDisplayName({ value, index })
                        }
                        maxLength="100"
                        autofocus
                      />
                    )
                  }
                  rowName={account.address}
                  bottomPart={
                    <AccountCmdBtnWrapper>
                      {editedAccountIndex === index ? (
                        [
                          <Link
                            onClick={() =>
                              this.saveEditedAccountDisplayName({ index })
                            }
                            text="SAVE"
                            style={{ marginRight: 15 }}
                            key="save"
                          />,
                          <Link
                            onClick={() =>
                              this.cancelEditingAccountDisplayName({ index })
                            }
                            text="CANCEL"
                            style={{ color: smColors.darkGray }}
                            key="cancel"
                          />,
                        ]
                      ) : (
                        <Link
                          onClick={() =>
                            this.startEditingAccountDisplayName({ index })
                          }
                          text="RENAME"
                        />
                      )}
                      <AccountCmdBtnSeparator />
                      <Link
                        onClick={() => this.toggleSignMessageModal({ index })}
                        text="SIGN TEXT"
                      />
                      <AccountCmdBtnSeparator />
                    </AccountCmdBtnWrapper>
                  }
                  key={account.address}
                />
              ))}
            </SettingsSection>
            <SettingsSection title={categories[3]} name={categories[3]}>
              <SettingRow
                upperPartLeft={getFormattedTimestamp(genesisTime)}
                isUpperPartLeftText
                rowName="Genesis time"
              />
              {!isWalletOnly && (
                <>
                  <SettingRow
                    upperPart={build}
                    isUpperPartLeftText
                    rowName="Node Build"
                  />
                  <SettingRow
                    upperPart={version}
                    isUpperPartLeftText
                    rowName="Node Version"
                  />
                  <SettingRow
                    upperPart={rootHash}
                    isUpperPartLeftText
                    rowName="State root hash"
                  />
                  <SettingRow
                    upperPartRight={
                      <Button
                        onClick={this.openLogFile}
                        text="View Logs"
                        width={180}
                      />
                    }
                    rowName="View logs file"
                  />
                </>
              )}
            </SettingsSection>
            <SettingsSection title={categories[4]} name={categories[4]}>
              <SettingRow
                upperPartLeft={dataPath}
                upperPartRight={
                  <Button
                    onClick={eventsService.changeDataDir}
                    text="CHANGE DIRECTORY"
                    width={180}
                  />
                }
                rowName="Move node data directory (restarts node)"
              />
              <SettingRow
                upperPartLeft={
                  isPortSet ? (
                    <Text>Please restart application to apply changes</Text>
                  ) : (
                    <Input
                      value={changedPort}
                      onChange={({ value }) =>
                        this.setState({ changedPort: value })
                      }
                      maxLength="10"
                    />
                  )
                }
                upperPartRight={
                  <Button onClick={this.setPort} text="SET PORT" width={180} />
                }
                rowName="Local node TCP and UDP port number"
              />
              <SettingRow
                upperPartLeft="Delete all wallets and app data"
                isUpperPartLeftText
                upperPartRight={
                  <Button
                    onClick={this.cleanAllAppDataAndSettings}
                    text="REINSTALL"
                    width={180}
                  />
                }
                rowName="Reinstall App"
              />
            </SettingsSection>
          </AllSettingsInnerWrapper>
        </AllSettingsWrapper>
        {showPasswordModal && (
          <EnterPasswordModal
            walletName={displayName}
            submitAction={passwordModalSubmitAction}
            closeModal={() => this.setState({ showPasswordModal: false })}
          />
        )}
        {signMessageModalAccountIndex !== -1 && (
          <SignMessage
            index={signMessageModalAccountIndex}
            close={() => this.toggleSignMessageModal({ index: -1 })}
          />
        )}
        {showModal && (
          <Modal header="Error" subHeader={'number must be >= 1024'}>
            <ButtonsWrapper>
              <Button
                onClick={() => this.setState({ showModal: false })}
                isPrimary
                text="OK"
              />
            </ButtonsWrapper>
          </Modal>
        )}
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { location } = this.props;
    if (location.state && location.state.currentSettingIndex) {
      scroller.scrollTo(
        categories[parseInt(location.state.currentSettingIndex)],
        {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart',
          containerId: 'settingsContainer',
        }
      );
    }
    const isAutoStartEnabled = await eventsService.isAutoStartEnabled();
    this.setState({ isAutoStartEnabled });
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    if (
      props.accounts &&
      props.accounts.length > prevState.accountDisplayNames.length
    ) {
      const updatedAccountDisplayNames = [...prevState.accountDisplayNames];
      updatedAccountDisplayNames.push(
        props.accounts[props.accounts.length - 1].displayName
      );
      return { accountDisplayNames: updatedAccountDisplayNames };
    }
    return null;
  }

  setSkin = ({ index }: { index: number }) => {
    const { switchSkin } = this.props;
    setClientSettingsTheme(index.toString());
    // @ts-ignore
    switchSkin(index.toString());
  };

  setPort = async () => {
    const { changedPort } = this.state;
    const parsedPort = parseInt(changedPort);
    if (parsedPort && parsedPort > 1024) {
      await eventsService.setPort({ port: changedPort });
      this.setState({ isPortSet: true });
    } else {
      this.setState({ showModal: true });
    }
  };

  restoreFromMnemonics = () => this.goTo(AuthPath.RecoverFromMnemonics);

  cancelEditingAccountDisplayName = ({ index }: { index: number }) => {
    const { accounts } = this.props;
    const { accountDisplayNames } = this.state;
    const updatedAccountDisplayNames = [...accountDisplayNames];
    updatedAccountDisplayNames[index] = accounts[index].displayName;
    this.setState({
      editedAccountIndex: -1,
      accountDisplayNames: updatedAccountDisplayNames,
    });
  };

  startEditingAccountDisplayName = ({ index }: { index: number }) => {
    const { editedAccountIndex } = this.state;
    if (editedAccountIndex !== -1) {
      this.cancelEditingAccountDisplayName({ index: editedAccountIndex });
    }
    this.setState({ editedAccountIndex: index });
  };

  openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  toggleSignMessageModal = ({ index }: { index: number }) => {
    this.setState({ signMessageModalAccountIndex: index });
  };

  lockWallet = (redirect: AuthPath) => {
    eventsService.closeWallet();
    this.goTo(redirect);
  };

  closeWallet = () => this.lockWallet(AuthPath.Unlock);

  createNewWallet = () => this.lockWallet(AuthPath.ConnectionType);

  openWalletFile = () => this.goTo(AuthPath.RecoverFromFile);

  saveEditedAccountDisplayName = ({ index }: { index: number }) => {
    const { accountDisplayNames } = this.state;
    const { currentWalletPath } = this.props;
    this.setState({
      showPasswordModal: true,
      passwordModalSubmitAction: ({ password }: { password: string }) => {
        this.setState({ editedAccountIndex: -1, showPasswordModal: false });
        eventsService.renameAccount({
          path: currentWalletPath,
          index,
          name: accountDisplayNames[index],
          password,
        });
      },
    });
  };

  editAccountDisplayName = ({
    value,
    index,
  }: {
    value: string;
    index: number;
  }) => {
    const { accountDisplayNames } = this.state;
    const updatedAccountDisplayNames = [...accountDisplayNames];
    updatedAccountDisplayNames[index] = value;
    this.setState({ accountDisplayNames: updatedAccountDisplayNames });
  };

  toggleAutoStart = () => {
    const { isAutoStartEnabled } = this.state;
    eventsService.toggleAutoStart();
    this.setState({ isAutoStartEnabled: !isAutoStartEnabled });
  };

  externalNavigation = (to: ExternalLinks) => window.open(to);

  navigateToWalletBackup = () => this.goTo(MainPath.BackupWallet);

  navigateToWalletRestore = () => this.goTo(AuthPath.Recover);

  cleanAllAppDataAndSettings = async () => {
    localStorage.clear();
    eventsService.wipeOut();
  };

  deleteWallet = async () => {
    const { walletFiles } = this.props;
    localStorage.clear();
    await eventsService.deleteWalletFile(walletFiles[0]);
  };

  cancelEditingWalletDisplayName = () => {
    const { displayName } = this.props;
    this.setState({
      walletDisplayName: displayName,
      canEditDisplayName: false,
    });
  };

  saveEditedWalletDisplayName = () => {
    const { displayName, updateWalletName } = this.props;
    const { walletDisplayName } = this.state;
    this.setState({ canEditDisplayName: false });
    if (
      !!walletDisplayName &&
      !!walletDisplayName.trim() &&
      walletDisplayName !== displayName
    ) {
      // @ts-ignore
      updateWalletName({ displayName: walletDisplayName });
    }
  };

  startEditingWalletDisplayName = () =>
    this.setState({ canEditDisplayName: true });

  editWalletDisplayName = ({ value }: { value: string }) =>
    this.setState({ walletDisplayName: value });

  createNewAccountWrapper = () => {
    const { createNewAccount } = this.props;
    this.setState({
      showPasswordModal: true,
      passwordModalSubmitAction: ({ password }: { password: string }) => {
        this.setState({ showPasswordModal: false });
        // @ts-ignore
        createNewAccount({ password });
      },
    });
  };

  switchToLocalNode = () => {
    const { setUiError, switchApiProvider } = this.props;
    // @ts-ignore
    switchApiProvider(LOCAL_NODE_API_URL).catch((err) => {
      console.error(err); // eslint-disable-line no-console
      setUiError(err);
    });
    this.goTo(AuthPath.Unlock);
  };

  switchToRemoteApi = () => {
    const { netId } = this.props;
    this.goTo(AuthPath.ConnectToAPI, { netId });
  };

  goTo = (redirect: RouterPath, state?: unknown) => {
    const { history } = this.props;
    history.push(redirect, state);
  };
}

const mapStateToProps = (state: RootState) => ({
  displayName: state.wallet.meta.displayName,
  accounts: state.wallet.accounts,
  walletFiles: state.wallet.walletFiles?.map(({ path }) => path) || [],
  currentWalletPath: state.wallet.currentWalletPath,
  genesisTime: state.network.genesisTime,
  rootHash: state.network.rootHash,
  build: state.node.build,
  version: state.node.version,
  port: state.node.port,
  dataPath: state.node.dataPath,
  backupTime: state.wallet.backupTime,
  isDarkMode: state.ui.isDarkMode,
  skinId: state.ui.skinId,
  isWalletOnly: isWalletOnly(state),
  netName: getNetworkName(state),
  netId: getNetworkId(state),
});

const mapDispatchToProps = {
  updateWalletName,
  createNewAccount,
  setUiError,
  switchApiProvider,
  switchSkin,
};

// @ts-ignore
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;
