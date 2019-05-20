// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { checkWhite, copyIcon } from '/assets/images';
import { smColors } from '/vars';
import type { Account } from '/types';

// $FlowStyledIssue
const PublicAddressInnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border: 1px solid ${({ copied }) => (copied ? smColors.white : 'transparent')};
  border-radius: 2px;
  cursor: inherit;
`;

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
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
  account: Account,
  fiatRate: number,
  style?: Object
};

type State = {
  copied: boolean
};

class AccountCard extends Component<Props, State> {
  copiedTimeout: Object;

  state = {
    copied: false
  };

  render() {
    const {
      account: { displayName, displayColor, pk, balance },
      fiatRate,
      style
    } = this.props;
    const { copied } = this.state;
    return (
      <Wrapper displayColor={displayColor} style={style} onClick={this.copyPublicAddress}>
        <UpperSection>
          <Header>{displayName}</Header>
          <SubHeader>Public address</SubHeader>
          <PublicAddressWrapper>
            <PublicAddressInnerWrapper copied={copied}>
              <PublicAddress>{pk.substring(0, 32)}</PublicAddress>
              <CopyIconWrapper>
                <CopyIcon src={copyIcon} />
              </CopyIconWrapper>
            </PublicAddressInnerWrapper>
            <CopiedWrapper>
              {copied && <CopiedIcon src={checkWhite} />}
              <CopiedText>{copied ? 'Address had been copied to clipboard' : ''}</CopiedText>
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

  componentWillUnmount(): void {
    clearTimeout(this.copiedTimeout);
  }

  copyPublicAddress = () => {
    const {
      account: { pk }
    } = this.props;
    clearTimeout(this.copiedTimeout);
    clipboard.writeText(pk);
    this.copiedTimeout = setTimeout(() => this.setState({ copied: false }), 3000);
    this.setState({ copied: true });
  };
}

export default AccountCard;
