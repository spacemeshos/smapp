// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { DropDown, WrapperWith2SideBars } from '/basicComponents';
import { copyToClipboard } from '/assets/images';
import { getAbbreviatedAddressText } from '/infra/utils';
import { smColors } from '/vars';
import type { Account } from '/types';

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

// $FlowStyledIssue
const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: inherit;
`;

const AccountName = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.realBlack};
  cursor: inherit;
`;

const Address = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
  cursor: inherit;
`;

const CopyIcon = styled.img`
  width: 16px;
  height: 15px;
  margin: 0 10px;
  cursor: pointer;
`;

const CopiedText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.green};
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

const SmcText = styled.div`
  font-size: 17px;
  line-height: 32px;
  color: ${smColors.green};
`;

type Props = {
  accounts: Account[],
  currentAccountIndex: number,
  switchAccount: ({ index: number }) => void
};

type State = {
  isCopied: boolean
};

class AccountCards extends Component<Props, State> {
  copiedTimeout: any;

  state = {
    isCopied: true
  };

  render() {
    const { accounts, currentAccountIndex, switchAccount } = this.props;
    const { isCopied } = this.state;
    const { displayName, pk, balance } = accounts[currentAccountIndex];
    return (
      <WrapperWith2SideBars width={300} height={480} header="WALLET">
        <AccountDetails>
          {accounts.length > 1 ? (
            <DropDown data={accounts} DdElement={({ pk }) => this.renderAccountRow({ displayName, pk })} onPress={switchAccount} selectedItemIndex={currentAccountIndex} />
          ) : (
            this.renderAccountRow({ displayName, isCopied, pk })
          )}
          <CopyIcon src={copyToClipboard} />
        </AccountDetails>
        <CopiedText>{isCopied ? 'Address had been copied to clipboard!' : ''}</CopiedText>
        <Footer>
          <BalanceHeader>BALANCE</BalanceHeader>
          <BalanceWrapper>
            <BalanceAmount>{balance}</BalanceAmount>
            <SmcText>SMC</SmcText>
          </BalanceWrapper>
        </Footer>
      </WrapperWith2SideBars>
    );
  }

  renderAccountRow = ({ displayName, pk }: { displayName: string, pk: string }) => (
    <AccountWrapper key={pk}>
      <AccountName>{displayName}</AccountName>
      <Address>{getAbbreviatedAddressText(pk, 6)}</Address>
    </AccountWrapper>
  );

  copyPublicAddress = () => {
    const { accounts, currentAccountIndex } = this.props;
    clearTimeout(this.copiedTimeout);
    clipboard.writeText(accounts[currentAccountIndex].pk);
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 3000);
    this.setState({ isCopied: true });
  };
}

export default AccountCards;
