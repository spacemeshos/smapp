// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { SimpleDropdown } from '/basicComponents';
import { checkWhite, copyIconWhite } from '/assets/images';
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

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 30px;
  background-color: ${({ displayColor }) => displayColor};
  cursor: pointer;
  &: hover ${PublicAddressInnerWrapper} {
    border: 1px solid ${smColors.white};
    background-color: ${smColors.green};
  }
`;

const UpperSection = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  cursor: inherit;
`;

const Header = styled.div`
  width: 100%;
  padding: 0 10px;
  font-size: 30px;
  font-weight: bold;
  line-height: 36px;
  color: ${smColors.white};
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: inherit;
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.white70Alpha};
  padding: 0 10px;
  margin-bottom: 5px;
  cursor: inherit;
`;

const PublicAddressWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  cursor: inherit;
`;

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
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 10px;
  cursor: inherit;
`;

const FiatBalance = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${smColors.white70Alpha};
  cursor: inherit;
`;

const Balance = styled.div`
  font-size: 31px;
  line-height: 40px;
  color: ${smColors.white};
  cursor: inherit;
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
    const { accounts, currentAccountIndex, switchAccount, fiatRate, clickHandler, isCopied } = this.props;
    const { displayName, displayColor, pk, balance } = accounts[currentAccountIndex];
    return (
      <Wrapper displayColor={displayColor} onClick={clickHandler}>
        <UpperSection>
          <Header>{displayName}</Header>
          <SubHeader>Public address</SubHeader>
          <PublicAddressWrapper>
            {accounts.length > 1 ? (
              <SimpleDropdownStyled
                data={accounts}
                DdElement={({ pk }) => this.renderPublicAddressRow({ isCopied, pk })}
                onPress={switchAccount}
                selectedItemIndex={currentAccountIndex}
              />
            ) : (
              this.renderPublicAddressRow({ isCopied, pk })
            )}
            <CopiedWrapper>
              {isCopied && <CopiedIcon src={checkWhite} />}
              <CopiedText>{isCopied ? 'Address had been copied to clipboard' : ''}</CopiedText>
            </CopiedWrapper>
          </PublicAddressWrapper>
        </UpperSection>
        <LowerSection>
          <FiatBalance>{fiatRate * balance} $</FiatBalance>
          <Balance>{balance} SMC</Balance>
        </LowerSection>
      </Wrapper>
    );
  }

  renderPublicAddressRow = ({ isCopied, pk }) => (
    <PublicAddressInnerWrapper isCopied={isCopied} key={pk}>
      <PublicAddress>{pk.substring(0, 32)}</PublicAddress>
      <CopyIconWrapper>
        <CopyIcon src={copyIconWhite} />
      </CopyIconWrapper>
    </PublicAddressInnerWrapper>
  );
}

export default AccountCards;
