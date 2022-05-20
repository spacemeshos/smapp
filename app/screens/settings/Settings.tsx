import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import {
  updateWalletName,
  updateAccountName,
  createNewAccount,
  switchApiProvider,
  closeWallet,
} from '../../redux/wallet/actions';
import { getGlobalStateHash } from '../../redux/network/actions';
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
import { getAddress, getFormattedTimestamp } from '../../infra/utils';
import { smColors } from '../../vars';
import { AppThDispatch, RootState } from '../../types';
import { Modal } from '../../components/common';
import { Account } from '../../../shared/types';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { ExternalLinks, LOCAL_NODE_API_URL } from '../../../shared/constants';
import { goToSwitchNetwork } from '../../routeUtils';
import { getNetworkId, getNetworkName } from '../../redux/network/selectors';
import { AuthPath, MainPath, RouterPath } from '../../routerPaths';
import { setClientSettingsTheme, SKINS } from '../../theme';

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
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const Name = styled.div`
  font-size: 14px;
  line-height: 40px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
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

const DropDownItem = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  width: 100%;
  cursor: inherit;
`;

interface Props extends RouteComponentProps {
  displayName: string;
  accounts: Account[];
  walletFiles: Array<string>;
  updateWalletName: AppThDispatch;
  updateAccountName: AppThDispatch;
  createNewAccount: AppThDispatch;
  getGlobalStateHash: AppThDispatch;
  switchSkin: AppThDispatch;
  setUiError: AppThDispatch;
  switchApiProvider: AppThDispatch;
  closeWallet: AppThDispatch;
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
  currentSettingIndex: number;
  showPasswordModal: boolean;
  passwordModalSubmitAction: ({ password }: { password: string }) => void;
  changedPort: string;
  isPortSet: boolean;
  signMessageModalAccountIndex: number;
  showModal: boolean;
};

class Settings extends Component<Props, State> {
  myRef1: any; // eslint-disable-line react/sort-comp

  myRef2: any; // eslint-disable-line react/sort-comp

  myRef3: any; // eslint-disable-line react/sort-comp

  myRef4: any; // eslint-disable-line react/sort-comp

  myRef5: any; // eslint-disable-line react/sort-comp

  constructor(props: Props) {
    super(props);
    const { displayName, accounts } = props;
    const accountDisplayNames = accounts.map(
      (account: Account) => account.displayName
    );
    this.state = {
      walletDisplayName: displayName,
      canEditDisplayName: false,
      isAutoStartEnabled: false,
      editedAccountIndex: -1,
      accountDisplayNames,
      currentSettingIndex: 0,
      showPasswordModal: false,
      passwordModalSubmitAction: () => {},
      changedPort: props.port,
      isPortSet: false,
      signMessageModalAccountIndex: -1,
      showModal: false,
    };

    this.myRef1 = React.createRef();
    this.myRef2 = React.createRef();
    this.myRef3 = React.createRef();
    this.myRef4 = React.createRef();
    this.myRef5 = React.createRef();
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
      isDarkMode,
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
      currentSettingIndex,
      showPasswordModal,
      passwordModalSubmitAction,
      changedPort,
      isPortSet,
      signMessageModalAccountIndex,
      showModal,
    } = this.state;

    return (
      <Wrapper>
        <SideMenu
          isDarkMode={isDarkMode}
          items={['GENERAL', 'WALLETS', 'ACCOUNTS', 'INFO', 'ADVANCED']}
          currentItem={currentSettingIndex}
          onClick={this.scrollToRef}
        />
        <AllSettingsWrapper>
          <AllSettingsInnerWrapper>
            <SettingsSection
              title="GENERAL"
              refProp={this.myRef1}
              isDarkMode={isDarkMode}
            >
              <SettingRow
                upperPartLeft={
                  <DropDown
                    data={Object.values(SKINS).map((name) => ({
                      label: name.slice(0, 1).toUpperCase() + name.slice(1),
                    }))}
                    onClick={this.setSkin}
                    DdElement={this.renderAccElement}
                    selectedItemIndex={skinId}
                    rowHeight={40}
                    bgColor={smColors.white}
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
            <SettingsSection
              title="WALLETS"
              refProp={this.myRef2}
              isDarkMode={isDarkMode}
            >
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
                      width={180}
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
            <SettingsSection
              title="ACCOUNTS"
              refProp={this.myRef3}
              isDarkMode={isDarkMode}
            >
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
                  rowName={`0x${getAddress(account.publicKey)}`}
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
                  key={account.publicKey}
                />
              ))}
            </SettingsSection>
            <SettingsSection
              title="INFO"
              refProp={this.myRef4}
              isDarkMode={isDarkMode}
            >
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
            <SettingsSection
              title="ADVANCED"
              refProp={this.myRef5}
              isDarkMode={isDarkMode}
            >
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
    const { location, getGlobalStateHash } = this.props;
    if (location.state && location.state.currentSettingIndex) {
      this.scrollToRef({ index: parseInt(location.state.currentSettingIndex) });
    }
    // @ts-ignore
    await getGlobalStateHash();
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

  navigateToWalletBackup = () => this.goTo(MainPath.BackupWallet);

  navigateToWalletRestore = () => this.goTo(AuthPath.Recover);

  externalNavigation = (to: ExternalLinks) => window.open(to);

  toggleAutoStart = () => {
    const { isAutoStartEnabled } = this.state;
    eventsService.toggleAutoStart();
    this.setState({ isAutoStartEnabled: !isAutoStartEnabled });
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

  saveEditedAccountDisplayName = ({ index }: { index: number }) => {
    const { updateAccountName } = this.props;
    const { accountDisplayNames } = this.state;
    this.setState({
      showPasswordModal: true,
      passwordModalSubmitAction: ({ password }: { password: string }) => {
        this.setState({ editedAccountIndex: -1, showPasswordModal: false });
        // @ts-ignore
        updateAccountName({
          accountIndex: index,
          name: accountDisplayNames[index],
          password,
        });
      },
    });
  };

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

  scrollToRef = ({ index }: { index: number }) => {
    const ref = [
      this.myRef1,
      this.myRef2,
      this.myRef3,
      this.myRef4,
      this.myRef5,
    ][index];
    this.setState({ currentSettingIndex: index });
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  toggleSignMessageModal = ({ index }: { index: number }) => {
    this.setState({ signMessageModalAccountIndex: index });
  };

  lockWallet = (redirect: AuthPath) => {
    const { closeWallet } = this.props;
    // @ts-ignore
    closeWallet();
    this.goTo(redirect);
  };

  closeWallet = () => this.lockWallet(AuthPath.Unlock);

  createNewWallet = () => this.lockWallet(AuthPath.ConnectionType);

  openWalletFile = () => this.goTo(AuthPath.RecoverFromFile);

  restoreFromMnemonics = () => this.goTo(AuthPath.RecoverFromMnemonics);

  renderAccElement = ({ label, text }: { label: string; text: string }) => (
    <DropDownItem key={label}>
      {label} {text}
    </DropDownItem>
  );

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

  switchToRemoteApi = () => {
    const { switchApiProvider } = this.props;
    // @ts-ignore
    switchApiProvider(null).catch((err) => {
      console.error(err); // eslint-disable-line no-console
      setUiError(err);
    });
    this.goTo(AuthPath.Unlock);
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

  goTo = (redirect: RouterPath) => {
    const { history } = this.props;
    history.push(redirect);
  };
}

const mapStateToProps = (state: RootState) => ({
  displayName: state.wallet.meta.displayName,
  accounts: state.wallet.accounts,
  walletFiles: state.wallet.walletFiles?.map(({ path }) => path) || [],
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
  getGlobalStateHash,
  updateWalletName,
  updateAccountName,
  createNewAccount,
  setUiError,
  switchApiProvider,
  closeWallet,
  switchSkin,
};

// @ts-ignore
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;
