// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Transaction } from '/components/transactions';
import { communication } from '/assets/images';
import { smColors } from '/vars';
import type { TxList } from '/types';

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px 60px;
`;

const Header = styled.div`
  font-size: 31px;
  font-weight: bold;
  line-height: 42px;
  color: ${smColors.lighterBlack};
  margin-bottom: 20px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-right: 30px;
`;

const RightSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 30px;
  padding: 25px;
  border: 1px solid ${smColors.borderGray};
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  padding: 15px 20px;
  border: 1px solid ${smColors.borderGray};
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const RightSectionSubHeader = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${smColors.darkGray};
  line-height: 19px;
  margin-bottom: 25px;
`;

const RightSectionText = styled.div`
  font-size: 16px;
  color: ${smColors.darkGray};
  line-height: 28px;
  margin-bottom: 25px;
`;

const RightSectionLink = styled.div`
  font-size: 16px;
  color: ${smColors.darkGreen};
  line-height: 30px;
  padding: 5px 0;
`;

type Props = {
  transactions: TxList
};

type State = {
  mode: number,
  isRestoreWith12WordsMode: boolean,
  mnemonic: string
};

class Transactions extends Component<Props, State> {
  render() {
    const { transactions } = this.props;
    return (
      <Wrapper>
        <Header>Transaction Log</Header>
        <InnerWrapper>
          <LeftSection>
            {transactions.map((tx) => (
              <Transaction transaction={tx} addToContacts={() => {}} />
            ))}
          </LeftSection>
          <RightSection>
            <ImageWrapper>
              <Image src={communication} />
            </ImageWrapper>
            <RightSectionSubHeader>Crypto Transactions</RightSectionSubHeader>
            <RightSectionText>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
              eos et accusam et justo duo dolores et ea.
            </RightSectionText>
            <RightSectionLink onClick={this.navigateToExplanation}>Learn more about Spacemesh Transactions</RightSectionLink>
          </RightSection>
        </InnerWrapper>
      </Wrapper>
    );
  }

  navigateToExplanation = () => {};
}

const mapStateToProps = (state) => ({
  transactions: state.wallet.transactions
});

Transactions = connect(mapStateToProps)(Transactions);

export default Transactions;
