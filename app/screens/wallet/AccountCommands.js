// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setRewardsAddress } from '/redux/node/actions';
import { Button, Link } from '/basicComponents';
import smColors from '/vars/colors';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 100%;
  margin-right: 10px;
  padding: 25px 15px;
  background-color: ${smColors.black02Alpha};
`;

const MiddleSectionHeader = styled.div`
  margin-bottom: 10px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const Text = styled.div`
  margin-top: 5px;
  font-size: 12px;
  line-height: 20px;
  color: ${smColors.orange};
`;

type Props = {
  account: Account,
  rewardsAddress: string,
  history: RouterHistory,
  setRewardsAddress: Action
};

class AccountCommands extends Component<Props> {
  render() {
    const { account, rewardsAddress, setRewardsAddress, history } = this.props;
    return (
      <Wrapper>
        <MiddleSection>
          <MiddleSectionHeader>
            Account Commands
            <br />
            --
          </MiddleSectionHeader>
          <Button onClick={this.navigateToSignMessage} text="Sign message" width={250} style={{ margin: '30px 0' }} />
          <Button onClick={setRewardsAddress} text="Set as coinbase" width={250} isDisabled={account.publicKey === rewardsAddress} />
          {account.publicKey === rewardsAddress && <Text>This account is the coinbase</Text>}
          <Link onClick={history.goBack} text="BACK" style={{ margin: 'auto auto 0 0', color: smColors.orange }} />
        </MiddleSection>
      </Wrapper>
    );
  }

  navigateToSignMessage = () => {
    const { history } = this.props;
    history.push('/main/wallet/sign-message');
  };
}

const mapStateToProps = (state) => ({
  account: state.wallet.accounts[state.wallet.currentAccountIndex],
  rewardsAddress: state.node.rewardsAddress
});

const mapDispatchToProps = {
  setRewardsAddress
};

AccountCommands = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(AccountCommands);
export default AccountCommands;
