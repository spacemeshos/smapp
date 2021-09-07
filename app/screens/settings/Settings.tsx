import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { updateWalletName, updateAccountName, createNewAccount } from '../../redux/wallet/actions';
import { getGlobalStateHash } from '../../redux/network/actions';
import { switchTheme } from '../../redux/ui/actions';
import { SettingsSection, SettingRow, ChangePassword, SideMenu, EnterPasswordModal, SignMessage } from '../../components/settings';
import { Input, Link, Button } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { getAddress, getFormattedTimestamp } from '../../infra/utils';
import { smColors } from '../../vars';
import { AppThDispatch, RootState } from '../../types';
import { Modal } from '../../components/common';
import { Account } from '../../../shared/types';

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

interface Props extends RouteComponentProps {
  displayName: string;
  accounts: Account[];
  walletFiles: Array<string>;
  updateWalletName: AppThDispatch;
  updateAccountName: AppThDispatch;
  createNewAccount: AppThDispatch;
  getGlobalStateHash: AppThDispatch;
  switchTheme: AppThDispatch;
  genesisTime: number;
  rootHash: string;
  build: string;
  version: string;
  port: string;
  backupTime: string;
  isDarkMode: boolean;
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { currentSettingIndex: string };
  };
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
    const accountDisplayNames = accounts.map((account: Account) => account.displayName);
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
      showModal: false
    };

    this.myRef1 = React.createRef();
    this.myRef2 = React.createRef();
    this.myRef3 = React.createRef();
    this.myRef4 = React.createRef();
    this.myRef5 = React.createRef();
  }

  render() {
    const { displayName, accounts, genesisTime, rootHash, build, version, backupTime, switchTheme, isDarkMode } = this.props;
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
      showModal
    } = this.state;

    return (
      <Wrapper>
        <SideMenu isDarkMode={isDarkMode} items={['GENERAL', 'WALLETS', 'ACCOUNTS', 'INFO', 'ADVANCED']} currentItem={currentSettingIndex} onClick={this.scrollToRef} />
        <AllSettingsWrapper>
          <AllSettingsInnerWrapper>
            <SettingsSection title="GENERAL" refProp={this.myRef1} isDarkMode={isDarkMode}>
              <SettingRow upperPartRight={<Button onClick={switchTheme} text="TOGGLE DARK MODE" width={180} />} rowName="Dark Mode" />
              <SettingRow
                upperPartLeft={`Auto start Spacemesh when your computer starts: ${isAutoStartEnabled ? 'ON' : 'OFF'}`}
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.toggleAutoStart} text="TOGGLE AUTO START" width={180} />}
                rowName="Wallet Auto Start"
              />
              <SettingRow
                upperPart={[<Text key={1}>Read our&nbsp;</Text>, <Link onClick={() => this.externalNavigation({ to: 'disclaimer' })} text="disclaimer" key={2} />]}
                rowName="Legal"
              />
              <SettingRow
                upperPartLeft="Learn more in our extensive user guide"
                isUpperPartLeftText
                upperPartRight={<Button onClick={() => this.externalNavigation({ to: 'userGuide' })} text="GUIDE" width={180} />}
                rowName="User Guide"
              />
            </SettingsSection>
            <SettingsSection title="WALLETS" refProp={this.myRef2} isDarkMode={isDarkMode}>
              <SettingRow
                upperPartLeft={canEditDisplayName ? <Input value={walletDisplayName} onChange={this.editWalletDisplayName} maxLength="100" /> : <Name>{walletDisplayName}</Name>}
                upperPartRight={
                  canEditDisplayName ? (
                    [
                      <Link onClick={this.saveEditedWalletDisplayName} text="SAVE" style={{ marginRight: 15 }} key="save" />,
                      <Link onClick={this.cancelEditingWalletDisplayName} text="CANCEL" style={{ color: smColors.darkGray }} key="cancel" />
                    ]
                  ) : (
                    <Button onClick={this.startEditingWalletDisplayName} text="RENAME" width={180} />
                  )
                }
                rowName="Display name"
              />
              <SettingRow upperPart={<ChangePassword />} rowName="Wallet password" />
              <SettingRow
                upperPartLeft={`Last Backup ${backupTime ? `at ${new Date(backupTime).toLocaleString()}` : 'was never backed-up.'}`}
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.navigateToWalletBackup} text="BACKUP NOW" width={180} />}
                rowName="Wallet Backup"
              />
              <SettingRow
                upperPartLeft="Restore wallet from backup file or 12 words"
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.navigateToWalletRestore} text="RESTORE" width={180} />}
                rowName="Wallet Restore"
              />
              <SettingRow
                upperPartLeft="Use at your own risk!"
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.deleteWallet} text="DELETE WALLET" width={180} />}
                rowName="Delete Wallet"
              />
              <SettingRow
                upperPartLeft="Create a new wallet. You will be signed out of current wallet"
                isUpperPartLeftText
                upperPartRight={<Button onClick={() => {}} text="CREATE" width={180} isDisabled />}
                rowName="Create a new wallet"
              />
            </SettingsSection>
            <SettingsSection title="ACCOUNTS" refProp={this.myRef3} isDarkMode={isDarkMode}>
              <SettingRow
                upperPartLeft={[<Text key={1}>New accounts will be added to&nbsp;</Text>, <GreenText key={2}>{displayName}</GreenText>]}
                upperPartRight={<Button onClick={this.createNewAccountWrapper} text="ADD ACCOUNT" width={180} />}
                rowName="Add a new account"
              />
              {accounts.map((account, index) => (
                <SettingRow
                  upperPartLeft={
                    editedAccountIndex !== index ? (
                      <Name>{accountDisplayNames[index]}</Name>
                    ) : (
                      <Input value={accountDisplayNames[index]} onChange={({ value }) => this.editAccountDisplayName({ value, index })} maxLength="100" autofocus />
                    )
                  }
                  rowName={`0x${getAddress(account.publicKey)}`}
                  bottomPart={
                    <AccountCmdBtnWrapper>
                      {editedAccountIndex === index ? (
                        [
                          <Link onClick={() => this.saveEditedAccountDisplayName({ index })} text="SAVE" style={{ marginRight: 15 }} key="save" />,
                          <Link onClick={() => this.cancelEditingAccountDisplayName({ index })} text="CANCEL" style={{ color: smColors.darkGray }} key="cancel" />
                        ]
                      ) : (
                        <Link onClick={() => this.startEditingAccountDisplayName({ index })} text="RENAME" />
                      )}
                      <AccountCmdBtnSeparator />
                      <Link onClick={() => this.toggleSignMessageModal({ index })} text="SIGN TEXT" />
                      <AccountCmdBtnSeparator />
                    </AccountCmdBtnWrapper>
                  }
                  key={account.publicKey}
                />
              ))}
            </SettingsSection>
            <SettingsSection title="INFO" refProp={this.myRef4} isDarkMode={isDarkMode}>
              <SettingRow upperPartLeft={getFormattedTimestamp(genesisTime)} isUpperPartLeftText rowName="Genesis time" />
              <SettingRow upperPart={build} isUpperPartLeftText rowName="Node Build" />
              <SettingRow upperPart={version} isUpperPartLeftText rowName="Node Version" />
              <SettingRow upperPart={rootHash} isUpperPartLeftText rowName="State root hash" />
              <SettingRow upperPartRight={<Button onClick={this.openLogFile} text="View Logs" width={180} />} rowName="View logs file" />
            </SettingsSection>
            <SettingsSection title="ADVANCED" refProp={this.myRef5} isDarkMode={isDarkMode}>
              <SettingRow
                upperPartLeft={
                  isPortSet ? (
                    <Text>Please restart application to apply changes</Text>
                  ) : (
                    <Input value={changedPort} onChange={({ value }) => this.setState({ changedPort: value })} maxLength="10" />
                  )
                }
                upperPartRight={<Button onClick={this.setPort} text="SET PORT" width={180} />}
                rowName="Local Smesher TCP and UDP port numbers"
              />
              <SettingRow
                upperPartLeft="Delete all wallets and app data, and restart it"
                isUpperPartLeftText
                upperPartRight={<Button onClick={this.cleanAllAppDataAndSettings} text="REINSTALL" width={180} />}
                rowName="Reinstall App"
              />
            </SettingsSection>
          </AllSettingsInnerWrapper>
        </AllSettingsWrapper>
        {showPasswordModal && (
          <EnterPasswordModal walletName={displayName} submitAction={passwordModalSubmitAction} closeModal={() => this.setState({ showPasswordModal: false })} />
        )}
        {signMessageModalAccountIndex !== -1 && <SignMessage index={signMessageModalAccountIndex} close={() => this.toggleSignMessageModal({ index: -1 })} />}
        {showModal && (
          <Modal header="Error" subHeader={'number must be >= 1024'}>
            <ButtonsWrapper>
              <Button onClick={() => this.setState({ showModal: false })} isPrimary text="OK" />
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
    } else {
      this.setState({ showModal: true });
    }
  };

  createNewAccountWrapper = () => {
    const { createNewAccount } = this.props;
    this.setState({
      showPasswordModal: true,
      passwordModalSubmitAction: ({ password }: { password: string }) => {
        this.setState({ showPasswordModal: false });
        // @ts-ignore
        createNewAccount({ password });
      }
    });
  };

  editWalletDisplayName = ({ value }: { value: string }) => this.setState({ walletDisplayName: value });

  startEditingWalletDisplayName = () => this.setState({ canEditDisplayName: true });

  saveEditedWalletDisplayName = () => {
    const { displayName, updateWalletName } = this.props;
    const { walletDisplayName } = this.state;
    this.setState({ canEditDisplayName: false });
    if (!!walletDisplayName && !!walletDisplayName.trim() && walletDisplayName !== displayName) {
      // @ts-ignore
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
        window.open('https://testnet.spacemesh.io/#/terms');
        break;
      }
      case 'disclaimer': {
        window.open('https://testnet.spacemesh.io/#/disclaimer');
        break;
      }
      case 'privacy': {
        window.open('https://testnet.spacemesh.io/#/privacy');
        break;
      }
      case 'userGuide': {
        window.open('https://testnet.spacemesh.io');
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

  editAccountDisplayName = ({ value, index }: { value: string; index: number }) => {
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

  scrollToRef = ({ index }: { index: number }) => {
    const ref = [this.myRef1, this.myRef2, this.myRef3, this.myRef4, this.myRef5][index];
    this.setState({ currentSettingIndex: index });
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  toggleSignMessageModal = ({ index }: { index: number }) => {
    this.setState({ signMessageModalAccountIndex: index });
  };
}

const mapStateToProps = (state: RootState) => ({
  displayName: state.wallet.meta.displayName,
  accounts: state.wallet.accounts,
  walletFiles: state.wallet.walletFiles,
  genesisTime: state.network.genesisTime,
  rootHash: state.network.rootHash,
  build: state.node.build,
  version: state.node.version,
  port: state.node.port,
  backupTime: state.wallet.backupTime,
  isDarkMode: state.ui.isDarkMode
});

const mapDispatchToProps = {
  getGlobalStateHash,
  updateWalletName,
  updateAccountName,
  createNewAccount,
  switchTheme
};

// @ts-ignore
Settings = connect(mapStateToProps, mapDispatchToProps)(Settings);

export default Settings;
