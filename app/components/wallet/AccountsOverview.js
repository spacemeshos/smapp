// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setCurrentAccount } from '/redux/wallet/actions';
import { DropDown, WrapperWith2SideBars } from '/basicComponents';
import { copyToClipboard } from '/assets/images';
import { getAbbreviatedText, getAddress, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';
import type { Account, Action } from '/types';

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
  ${({ isInDropDown }) => isInDropDown && 'opacity: 0.5;'}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

const AccountName = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.realBlack};
  cursor: inherit;
`;

const Address = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
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
  color: ${smColors.black};
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
  margin-left: 6px;
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
  setCurrentAccount: Action,
  status: Object
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
    const { walletName, accounts, currentAccountIndex, setCurrentAccount, status } = this.props;
    const { isCopied } = this.state;
    if (!accounts || !accounts.length) {
      return null;
    }
    const { displayName, publicKey, balance } = accounts[currentAccountIndex];
    const { value, unit } = formatSmidge(balance || 0, true);
    return (
      <WrapperWith2SideBars width={300} height={480} style={{ height: 'calc(100% - 65px)' }} header={walletName}>
        <AccountDetails>
          {accounts.length > 1 ? (
            <DropDown
              data={accounts}
              DdElement={({ displayName, publicKey, isMain }) => this.renderAccountRow({ displayName, publicKey, isInDropDown: !isMain })}
              onPress={setCurrentAccount}
              selectedItemIndex={currentAccountIndex}
              rowHeight={55}
            />
          ) : (
            this.renderAccountRow({ displayName, publicKey })
          )}
        </AccountDetails>
        {isCopied && <CopiedText>COPIED</CopiedText>}
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

  renderAccountRow = ({ displayName, publicKey, isInDropDown }: { displayName: string, publicKey: string, isInDropDown?: boolean }) => (
    <AccountWrapper isInDropDown={isInDropDown}>
      <AccountName>{displayName}</AccountName>
      <Address>
        {getAbbreviatedText(getAddress(publicKey))}
        <CopyIcon src={copyToClipboard} onClick={this.copyPublicAddress} />
      </Address>
    </AccountWrapper>
  );

  copyPublicAddress = () => {
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
  currentAccountIndex: state.wallet.currentAccountIndex
});

const mapDispatchToProps = {
  setCurrentAccount
};

AccountsOverview = connect(mapStateToProps, mapDispatchToProps)(AccountsOverview);

export default AccountsOverview;
