// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { SimpleDropdown, WrapperWith2SideBars } from '/basicComponents';
import { checkWhite, copyIconWhite } from '/assets/images';
import { getAbbreviatedAddressText } from '/infra/utils';
import { smColors } from '/vars';
import type { Account } from '/types';

// $FlowStyledIssue
const PublicAddressInnerWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border: 1px solid ${({ isCopied }) => (isCopied ? smColors.white : 'transparent')};
  border-radius: 2px;
  cursor: inherit;
`;

const UpperSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const PublicAddressWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  cursor: inherit;
`;

// $FlowStyledIssue
const SimpleDropdownStyled = styled(SimpleDropdown)`
  background-color: ${({ displayColor }) => displayColor};
  &: hover ${PublicAddressInnerWrapper} {
    border: 1px solid ${smColors.white};
    background-color: ${smColors.green};
  }
`;

const PublicAddress = styled.div`
  font-size: 18px;
  line-height: 24px;
  color: ${smColors.white70Alpha};
  cursor: inherit;
`;

const CopyIconWrapper = styled.div`
  width: 39px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: inherit;
`;

const CopyIcon = styled.img`
  width: 19px;
  height: 22px;
  cursor: inherit;
`;

const CopiedWrapper = styled.div`
  width: 100%;
  height: 22px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  cursor: inherit;
`;

const CopiedIcon = styled.img`
  width: 10px;
  height: 7px;
  margin-right: 10px;
`;

const CopiedText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.white70Alpha};
`;

const LowerSection = styled.div`
  display: flex;
  flex-direction: column;
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
  fiatRate: number,
  clickHandler: () => void,
  switchAccount: ({ index: number }) => void,
  isCopied: boolean
};

class AccountCards extends Component<Props> {
  render() {
    const { accounts, currentAccountIndex, switchAccount, isCopied } = this.props;
    const { displayName, pk, balance } = accounts[currentAccountIndex];
    return (
      <WrapperWith2SideBars width={300} height={480} header="WALLET">
        <UpperSection>
          <PublicAddressWrapper>
            {accounts.length > 1 ? (
              <SimpleDropdownStyled
                data={accounts}
                DdElement={({ pk }) => this.renderPublicAddressRow({ displayName, isCopied, pk })}
                onPress={switchAccount}
                selectedItemIndex={currentAccountIndex}
              />
            ) : (
              this.renderPublicAddressRow({ displayName, isCopied, pk })
            )}
            <CopiedWrapper>
              {isCopied && <CopiedIcon src={checkWhite} />}
              <CopiedText>{isCopied ? 'Address had been copied to clipboard' : ''}</CopiedText>
            </CopiedWrapper>
          </PublicAddressWrapper>
        </UpperSection>
        <LowerSection>
          <BalanceHeader>BALANCE</BalanceHeader>
          <BalanceWrapper>
            <BalanceAmount>{balance}</BalanceAmount>
            <SmcText>SMC</SmcText>
          </BalanceWrapper>
        </LowerSection>
      </WrapperWith2SideBars>
    );
  }

  renderPublicAddressRow = ({ displayName, isCopied, pk }: { displayName: string, isCopied: boolean, pk: string }) => (
    <PublicAddressInnerWrapper isCopied={isCopied} key={pk}>
      <PublicAddress>{getAbbreviatedAddressText(pk, 4)}</PublicAddress>
      <CopyIconWrapper>
        <CopyIcon src={copyIconWhite} />
      </CopyIconWrapper>
    </PublicAddressInnerWrapper>
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
