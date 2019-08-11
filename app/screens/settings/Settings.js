import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateWalletMeta, updateAccount, createNewAccount } from '/redux/wallet/actions';
import { SettingsRow, ChangePassphrase } from '/components/settings';
import { SmButton, SmInput, SmDropdown } from '/basicComponents';
import { smColors } from '/vars';
import type { WalletMeta, Account, Action } from '/types';
import { fileSystemService } from '/infra/fileSystemService';
import { autoStartService } from '/infra/autoStartService';
import { ScreenErrorBoundary } from '/components/errorHandler';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 60px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
`;

const HeaderText = styled.div`
  font-size: 31px;
  line-height: 42px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
`;

const WalletName = styled.div`
  font-size: 31px;
  line-height: 42px;
  font-weight: bold;
  color: ${smColors.lighterBlack50Alpha};
`;

const InnerWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: visible;
`;

const MetaWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 25px;
`;

const SettingsFieldName = styled.div`
  min-width: 150px;
  margin-right: 20px;
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  color: ${smColors.darkGray};
`;

const ColorDdElement = styled.div`
  width: 80px;
  height: 25px;
  background-color: ${({ label }) => label};
  border-radius: 2px;
  cursor: pointer;
`;

const MetaPlaceholder = styled.div`
  flex: 2;
`;

const Accounts = styled.div`
  margin-bottom: 25px;
`;

const AccountsRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: ${({ withPadding }) => (withPadding ? '15px 0' : '0 0 15px 0')};
  border-bottom: 1px solid ${smColors.borderGray};
`;

const AccountsRowHeader = styled.div`
  flex: 2;
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.darkGray};
  font-weight: bold;
  margin-right: 30px;
`;

const AccountsRowHeaderLast = styled(AccountsRowHeader)`
  flex: 1;
  margin-right: 0;
`;

const AccountsRowText = styled.div`
  flex: 2;
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.lighterBlack};
  margin-right: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddAccountBtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 40px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.darkGray50Alpha};
`;

const Link = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.green};
  cursor: pointer;
`;

const inputStyle = { border: '1px solid transparent', paddingLeft: 0 };
const dropDownStyle = { flex: '0 0 150px' };
const buttonStyle = { width: 200 };

const colors = [{ label: '#064FAE' }, { label: '#FFA000' }, { label: '#03946B' }, { label: '#00C28C' }, { label: '#95989A' }];
const languages = [{ label: 'English' }];
const currencies = [{ label: 'USD' }];

type Props = {
  meta: WalletMeta,
  accounts: Account[],
  walletFiles: Array<string>,
  updateWalletMeta: Action,
  updateAccount: Action,
  createNewAccount: Action,
  history: RouterHistory
};

type State = {
  shouldShowChangePassphrase: boolean,
  isAutoStartEnabled: boolean
};

class Settings extends Component<Props, State> {
  state = {
    shouldShowChangePassphrase: false,
    isAutoStartEnabled: autoStartService.isAutoStartEnabled()
  };

  render() {
    const {
      meta: { displayName, displayColor },
      accounts,
      walletFiles,
      createNewAccount
    } = this.props;
    const { shouldShowChangePassphrase, isAutoStartEnabled } = this.state;
    return [
      <Wrapper key="wrapper">
        <HeaderWrapper>
          <HeaderText>Settings</HeaderText>
          <WalletName>{displayName}</WalletName>
        </HeaderWrapper>
        <InnerWrapper>
          <div>
            <MetaWrapper>
              <SettingsFieldName>Wallet name</SettingsFieldName>
              <SmInput
                type="text"
                placeholder="Type wallet name"
                defaultValue={displayName}
                onChange={this.updateWalletName}
                hasDebounce
                isErrorMsgEnabled={false}
                wrapperStyle={{ flex: 1 }}
              />
              <MetaPlaceholder />
            </MetaWrapper>
            <MetaWrapper>
              <SettingsFieldName>Wallet color</SettingsFieldName>
              <SmDropdown
                data={colors}
                selectedItemIndex={colors.findIndex((color) => displayColor === color.label)}
                onPress={this.changeWalletColor}
                CustomElement={ColorDdElement}
                style={dropDownStyle}
              />
              <MetaPlaceholder />
            </MetaWrapper>
            <Accounts>
              <AccountsRow>
                <AccountsRowHeader>Public addresses</AccountsRowHeader>
                <AccountsRowHeader>Account name</AccountsRowHeader>
                <AccountsRowHeaderLast>Account color</AccountsRowHeaderLast>
              </AccountsRow>
              {accounts.map((account, accountIndex) => (
                <AccountsRow key={accounts[accountIndex].pk} withPadding>
                  <AccountsRowText>{accounts[accountIndex].pk}</AccountsRowText>
                  <SmInput
                    type="text"
                    placeholder="Type account name"
                    defaultValue={accounts[accountIndex].displayName}
                    onChange={this.updateAccountName({ accountIndex })}
                    hasDebounce
                    isErrorMsgEnabled={false}
                    wrapperStyle={{ flex: '2', marginRight: 30 }}
                    style={inputStyle}
                  />
                  <SmDropdown
                    data={colors}
                    selectedItemIndex={colors.findIndex((color) => accounts[accountIndex].displayColor === color.label)}
                    onPress={this.changeAccountColor({ accountIndex })}
                    CustomElement={ColorDdElement}
                  />
                </AccountsRow>
              ))}
            </Accounts>
            <AddAccountBtnWrapper>
              <SmButton text="+ add another account" theme="green" onPress={createNewAccount} style={buttonStyle} />
            </AddAccountBtnWrapper>
            <SettingsRow text="Wallet Passphrase" action={() => this.setState({ shouldShowChangePassphrase: true })} actionText="Change Passphrase" withTopBorder />
            <SettingsRow
              text="Wallet Language"
              customAction={[<SmDropdown data={languages} selectedItemIndex={0} onPress={() => {}} isDisabled style={dropDownStyle} key="1" />, <MetaPlaceholder key="2" />]}
            />
            <SettingsRow
              text="Local Currency"
              customAction={[<SmDropdown data={currencies} selectedItemIndex={0} onPress={() => {}} isDisabled style={dropDownStyle} key="1" />, <MetaPlaceholder key="2" />]}
            />
            <SettingsRow text="Wallet Backup" action={this.navigateToWalletBackup} actionText="Backup Wallet" />
            <SettingsRow text="Wallet Restore" action={this.navigateToWalletRestore} actionText="Restore Wallet" />
            <SettingsRow
              text="Terms of Service & Privacy Policy"
              customSubText={[
                <Text key="1">Read about the&nbsp;</Text>,
                <Link onClick={() => this.externalNavigation({ to: 'privacy' })} key="2">
                  privacy
                </Link>,
                <Text key="3">&nbsp;and&nbsp;</Text>,
                <Link onClick={() => this.externalNavigation({ to: 'security' })} key="4">
                  security
                </Link>,
                <Text key="5">&nbsp;of your personal information, our&nbsp;</Text>,
                <Link onClick={() => this.externalNavigation({ to: 'terms' })} key="6">
                  terms
                </Link>,
                <Text key="7">&nbsp;and&nbsp;</Text>,
                <Link onClick={() => this.externalNavigation({ to: 'serviceAgreement' })} key="8">
                  service agreement
                </Link>
              ]}
            />
            <SettingsRow text="Wallets" subText="You have one wallet" action={this.createNewWallet} actionText="Create a new wallet" isDisabled />
            <SettingsRow text="Learn more in our extensive user guide" action={() => this.externalNavigation({ to: 'userGuide' })} actionText="Visit the user guide" />
            <SettingsRow
              text="Delete wallet file and Logout. Use at your own risk!"
              action={this.deleteWalletData}
              actionText="Delete Wallet File"
              isDisabled={!(walletFiles && !!walletFiles.length)}
            />
            <SettingsRow
              text="Toggle wallet auto start"
              subText={`Auto start is ${isAutoStartEnabled ? 'ON' : 'OFF'}`}
              action={this.toggleAutoStart}
              actionText="Toggle auto start"
            />
          </div>
        </InnerWrapper>
      </Wrapper>,
      shouldShowChangePassphrase && <ChangePassphrase key="modal" goBack={() => this.setState({ shouldShowChangePassphrase: false })} />
    ];
  }

  updateWalletName = async ({ value }: { value: string }) => {
    const {
      meta: { displayName },
      updateWalletMeta
    } = this.props;
    if (!!value && !!value.trim() && value !== displayName) {
      await updateWalletMeta({ metaFieldName: 'displayName', data: value });
    }
  };

  deleteWalletData = async () => {
    const { walletFiles } = this.props;
    fileSystemService.deleteWalletFile({ fileName: walletFiles[0] });
  };

  changeWalletColor = async ({ index }: { index: number }) => {
    const {
      meta: { displayColor },
      updateWalletMeta
    } = this.props;
    if (colors[index] !== displayColor) {
      await updateWalletMeta({ metaFieldName: 'displayColor', data: colors[index].label });
    }
  };

  updateAccountName = ({ accountIndex }) => async ({ value }: { value: string }) => {
    const { accounts, updateAccount } = this.props;
    if (!!value && !!value.trim() && value !== accounts[accountIndex].displayName) {
      await updateAccount({ accountIndex, fieldName: 'displayName', data: value });
    }
  };

  changeAccountColor = ({ accountIndex }) => async ({ index }) => {
    const { accounts, updateAccount } = this.props;
    if (colors[index] !== accounts[accountIndex].displayColor) {
      await updateAccount({ accountIndex, fieldName: 'displayColor', data: colors[index].label });
    }
  };

  addAccount = () => {};

  navigateToWalletBackup = () => {
    const { history } = this.props;
    history.push('/main/wallet/backup');
  };

  createNewWallet = () => {};

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
}

const mapStateToProps = (state) => ({
  meta: state.wallet.meta,
  accounts: state.wallet.accounts,
  walletFiles: state.wallet.walletFiles
});

const mapDispatchToProps = {
  updateWalletMeta,
  updateAccount,
  createNewAccount
};

Settings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

Settings = ScreenErrorBoundary(Settings);
export default Settings;
