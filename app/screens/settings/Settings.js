import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateWalletMeta, updateAccount } from '/redux/wallet/actions';
import { SmButton, SmInput, SmDropdown } from '/basicComponents';
import type { WalletMeta, Account, Action } from '/types';
import smColors from '/vars/colors';

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

// $FlowStyledIssue
const SettingsRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}` : 0)}px;
  padding: 20px 0;
  border-bottom: 1px solid ${smColors.borderGray};
  ${({ withTopBorder }) => withTopBorder && `border-top: 1px solid ${smColors.borderGray};`}
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
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
  updateWalletMeta: Action,
  updateAccount: Action
};

type State = {
  hasChanges: boolean,
  walletName: string,
  walletColor: string,
  accountNames: Array<string>,
  hasAccountNameChanged: Array<boolean>
};

class Settings extends Component<Props, State> {
  render() {
    const {
      meta: { displayName, displayColor },
      accounts
    } = this.props;
    return (
      <Wrapper>
        <HeaderWrapper>
          <HeaderText>Settings</HeaderText>
          <WalletName>{displayName}</WalletName>
        </HeaderWrapper>
        <InnerWrapper>
          <div>
            <MetaWrapper>
              <SettingsFieldName>Wallet name</SettingsFieldName>
              <SmInput type="text" placeholder="Type wallet name" defaultValue={displayName} onChange={this.updateWalletName} hasDebounce isErrorMsgEnabled={false} />
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
              <SmButton text="+ add another account" theme="green" onPress={this.addAccount} isDisabled style={buttonStyle} />
            </AddAccountBtnWrapper>
            <SettingsRowWrapper withTopBorder>
              <SettingsFieldName>Wallet Passphrase</SettingsFieldName>
              <SmButton text="Change Passphrase" onPress={this.changePassphrase} style={buttonStyle} />
            </SettingsRowWrapper>
            <SettingsRowWrapper>
              <SettingsFieldName>Wallet Language</SettingsFieldName>
              <SmDropdown data={languages} selectedItemIndex={0} onPress={() => {}} isDisabled style={dropDownStyle} />
              <MetaPlaceholder />
            </SettingsRowWrapper>
            <SettingsRowWrapper>
              <SettingsFieldName>Local Currency</SettingsFieldName>
              <SmDropdown data={currencies} selectedItemIndex={0} onPress={() => {}} isDisabled style={dropDownStyle} />
              <MetaPlaceholder />
            </SettingsRowWrapper>
            <SettingsRowWrapper>
              <SettingsFieldName>Wallet Backup</SettingsFieldName>
              <SmButton text="Backup Wallet" onPress={this.navigateToWalletBackup} style={buttonStyle} />
            </SettingsRowWrapper>
            <SettingsRowWrapper>
              <SettingsFieldName>Restore Wallet</SettingsFieldName>
              <SmButton text="Restore Wallet" onPress={this.navigateToWalletRestore} style={buttonStyle} />
            </SettingsRowWrapper>
            <SettingsRowWrapper>
              <div>
                <SettingsFieldName>Terms of Service & Privacy Policy</SettingsFieldName>
                <TextWrapper>
                  <Text>Read about the&nbsp;</Text>
                  <Link onClick={() => this.externalNavigation({ to: 'privacy' })}>privacy</Link>
                  <Text>&nbsp;and&nbsp;</Text>
                  <Link onClick={() => this.externalNavigation({ to: 'security' })}>security</Link>
                  <Text>&nbsp;of your personal information, our&nbsp;</Text>
                  <Link onClick={() => this.externalNavigation({ to: 'terms' })}>terms</Link>
                  <Text>&nbsp;and&nbsp;</Text>
                  <Link onClick={() => this.externalNavigation({ to: 'serviceAgreement' })}>service agreement</Link>
                </TextWrapper>
              </div>
            </SettingsRowWrapper>
            <SettingsRowWrapper>
              <div>
                <SettingsFieldName>Wallets</SettingsFieldName>
                <Text>You have one wallet</Text>
              </div>
              <SmButton text="Create a new wallet" onClick={this.createNewWallet} isDisabled style={buttonStyle} />
            </SettingsRowWrapper>
            <SettingsRowWrapper marginBottom={30}>
              <SettingsFieldName>Learn more in our extensive user guide</SettingsFieldName>
              <SmButton text="Visit the user guide" onPress={() => this.externalNavigation({ to: 'userGuide' })} style={buttonStyle} />
            </SettingsRowWrapper>
          </div>
        </InnerWrapper>
      </Wrapper>
    );
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

  changePassphrase = () => {};

  navigateToWalletBackup = () => {};

  navigateToWalletRestore = () => {};

  createNewWallet = () => {};

  externalNavigation = () => {};
}

const mapStateToProps = (state) => ({
  meta: state.wallet.meta,
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  updateWalletMeta,
  updateAccount
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
