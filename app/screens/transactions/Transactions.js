// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Transaction } from '/components/transactions';
import { SmButton } from '/basicComponents';
import { communication } from '/assets/images';
import { smColors } from '/vars';
import type { TxList } from '/types';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
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
  flex: 1;
  flex-direction: row;
`;

const LeftSection = styled.div`
  height: 100%;
  display: flex;
  flex: 2;
  flex-direction: column;
  margin-right: 30px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
`;

const TransactionsListWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: visible;
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

const btnStyle = { height: 26, marginRight: 15 };

type Props = {
  transactions: TxList
};

type State = {
  isSentDisplayed: boolean,
  isReceivedDisplayed: boolean,
  isPendingDisplayed: boolean,
  isRejectedDisplayed: boolean
};

class Transactions extends Component<Props, State> {
  state = {
    isSentDisplayed: true,
    isReceivedDisplayed: true,
    isPendingDisplayed: true,
    isRejectedDisplayed: true
  };

  render() {
    const { transactions } = this.props;
    const { isSentDisplayed, isReceivedDisplayed, isPendingDisplayed, isRejectedDisplayed } = this.state;
    return (
      <Wrapper>
        <Header>Transaction Log</Header>
        <InnerWrapper>
          <LeftSection>
            <ButtonsWrapper>
              <SmButton text="Sent" theme="green" onPress={() => this.setState({ isSentDisplayed: !isSentDisplayed })} isActive={isSentDisplayed} style={btnStyle} />
              <SmButton
                text="Received"
                theme="green"
                onPress={() => this.setState({ isReceivedDisplayed: !isReceivedDisplayed })}
                isActive={isReceivedDisplayed}
                style={btnStyle}
              />
              <SmButton text="Pending" theme="green" onPress={() => this.setState({ isPendingDisplayed: !isPendingDisplayed })} isActive={isPendingDisplayed} style={btnStyle} />
              <SmButton
                text="Rejected"
                theme="green"
                onPress={() => this.setState({ isRejectedDisplayed: !isRejectedDisplayed })}
                isActive={isRejectedDisplayed}
                style={btnStyle}
              />
            </ButtonsWrapper>
            <TransactionsListWrapper>
              {transactions ? (
                transactions.map((tx, index) => (
                  <Transaction
                    key={index}
                    transaction={tx}
                    addToContacts={() => {}}
                    isSentDisplayed={isSentDisplayed}
                    isReceivedDisplayed={isReceivedDisplayed}
                    isPendingDisplayed={isPendingDisplayed}
                    isRejectedDisplayed={isRejectedDisplayed}
                  />
                ))
              ) : (
                <RightSectionText>No transactions executed yet</RightSectionText>
              )}
            </TransactionsListWrapper>
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
  transactions: state.wallet.transactions[state.wallet.currentAccountIndex]
});

Transactions = connect(mapStateToProps)(Transactions);

export default Transactions;
