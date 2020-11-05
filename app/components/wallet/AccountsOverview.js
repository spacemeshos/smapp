// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setCurrentAccount, getBalance } from '/redux/wallet/actions';
import { DropDown, WrapperWith2SideBars } from '/basicComponents';
import { copyBlack, copyWhite } from '/assets/images';
import { getAbbreviatedText, getAddress, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';
import type { Account, Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px;
  cursor: inherit;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
  &:hover {
    opacity: 1;
    color: ${({ theme }) => (theme.isDarkModeOn ? smColors.lightGray : smColors.darkGray50Alpha)};
  }
  ${({ isInDropDown }) =>
    isInDropDown &&
    `opacity: 0.5; color: ${smColors.realBlack}; &:hover {
    opacity: 1;
    color: ${({ theme }) => (theme.isDarkModeOn ? smColors.darkGray50Alpha : smColors.darkGray50Alpha)};
  }`}
`;

const AccountName = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
`;

const Address = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
`;

const CopyIcon = styled.img`
  align-self: flex-end;
  width: 16px;
  height: 15px;
  margin: 6px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
`;

const BalanceHeader = styled.div`
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
`;

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const BalanceAmount = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.green};
`;

const SmhText = styled.div`
  font-size: 17px;
  line-height: 32px;
  color: ${smColors.green};
`;

const CopiedText = styled.div`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  height: 20px;
  margin: -20px 0 5px 6px;
  color: ${smColors.green};
`;

const NotSyncedYetText = styled.div`
  font-size: 15px;
  line-height: 32px;
  color: ${smColors.orange};
`;

type Props = {
  walletName: string,
  accounts: Account[],
  currentAccountIndex: number,
  getBalance: Action,
  setCurrentAccount: Action,
  status: Object,
  history: RouterHistory,
  isDarkModeOn: boolean
};

type State = {
  isCopied: boolean
};

class AccountsOverview extends Component<Props, State> {
  copiedTimeout: TimeoutID;

  state = {
    isCopied: false
  };

  render() {
    const { walletName, accounts, currentAccountIndex, status, isDarkModeOn } = this.props;
    const { isCopied } = this.state;
    if (!accounts || !accounts.length) {
      return null;
    }
    const { displayName, publicKey, balance } = accounts[currentAccountIndex];
    const { value, unit } = formatSmidge(balance || 0, true);

    return (
      <WrapperWith2SideBars width={300} style={{ height: 'calc(100% - 65px)' }} header={walletName} isDarkModeOn={isDarkModeOn}>
        <AccountDetails>
          {accounts.length > 1 ? (
            <DropDown
              data={accounts}
              DdElement={({ displayName, publicKey, isMain }) => this.renderAccountRow({ displayName, publicKey, isInDropDown: !isMain })}
              onPress={this.setCurrentAccount}
              selectedItemIndex={currentAccountIndex}
              rowHeight={55}
              whiteIcon={isDarkModeOn}
              rowContentCentered={false}
            />
          ) : (
            this.renderAccountRow({ displayName, publicKey })
          )}
        </AccountDetails>
        <CopiedText>{isCopied ? 'COPIED' : ''}</CopiedText>
        <Footer>
          <BalanceHeader>BALANCE</BalanceHeader>
          {status?.synced ? (
            <BalanceWrapper>
              <BalanceAmount>{value}</BalanceAmount>
              <SmhText>{unit}</SmhText>
            </BalanceWrapper>
          ) : (
            <NotSyncedYetText>Syncing...</NotSyncedYetText>
          )}
        </Footer>
      </WrapperWith2SideBars>
    );
  }

  componentWillUnmount() {
    this.copiedTimeout && clearTimeout(this.copiedTimeout);
  }

  renderAccountRow = ({ displayName, publicKey, isInDropDown, isDarkModeOn }: { displayName: string, publicKey: string, isInDropDown?: boolean, isDarkModeOn: boolean }) => (
    <AccountWrapper isInDropDown={isInDropDown}>
      <AccountName>{displayName}</AccountName>
      <Address>
        {getAbbreviatedText(getAddress(publicKey))}
        <CopyIcon src={isDarkModeOn ? copyWhite : copyBlack} onClick={this.copyPublicAddress} />
      </Address>
    </AccountWrapper>
  );

  setCurrentAccount = async ({ index }: { index: number }) => {
    const { setCurrentAccount, getBalance } = this.props;
    setCurrentAccount({ index });
    await getBalance();
  };

  // TODO temporary solution - link to vault
  navigateToVault = () => {
    const { history } = this.props;
    history.push('/main/wallet/vault');
  };

  copyPublicAddress = (e) => {
    e.stopPropagation();
    const { accounts, currentAccountIndex } = this.props;
    clearTimeout(this.copiedTimeout);
    clipboard.writeText(`0x${getAddress(accounts[currentAccountIndex].publicKey)}`);
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 10000);
    this.setState({ isCopied: true });
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  walletName: state.wallet.meta.displayName,
  accounts: state.wallet.accounts,
  currentAccountIndex: state.wallet.currentAccountIndex,
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  setCurrentAccount,
  getBalance
};

AccountsOverview = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(AccountsOverview);

export default AccountsOverview;
