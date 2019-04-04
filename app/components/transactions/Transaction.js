// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { arrowDownGreen, arrowDownOrange, arrowUpGreen, arrowUpOrange, arrowUpRed, arrowDownRed, addToContactsIcon } from '/assets/images';
import { smColors } from '/vars';
import type { Tx } from '/types';

const Wrapper = styled.div`
  height: 90px;
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  border-bottom: 1px solid ${smColors.borderGray};
  &: first-child {
    border-top: 1px solid ${smColors.borderGray};
  }
`;

const FirstSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 30px;
`;

const Icon = styled.img`
  width: 11px;
  height: 11px;
`;

const FirstSectionText = styled.div`
  font-size: 9px;
  font-weight: 300;
  line-height: 13px;
  color: ${smColors.mediumGray};
`;

const SecondSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  justify-content: space-between;
  margin-right: 30px;
`;

const SentReceivedTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// $FlowStyledIssue
const SentReceivedText = styled.div`
  font-size: 12px;
  color: ${({ color }) => color};
  line-height: 17px;
`;

const PendingText = styled.div`
  font-size: 12px;
  color: ${smColors.darkGray};
  line-height: 17px;
`;

const RejectedText = styled.div`
  font-size: 12px;
  color: ${smColors.red};
  line-height: 17px;
`;

const Amount = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
  line-height: 17px;
`;

const Address = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${smColors.lighterBlack};
  line-height: 17px;
`;

const ThirdSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  flex: 3;
`;

const AddToContactsBtnWrapper = styled.div`
  width: 150px;
  height: 26px;
`;

const AddToContactsBtn = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${smColors.orange};
  border-radius: 2px;
  cursor: pointer;
`;

const AddToContactsText = styled.div`
  font-size: 12px;
  color: ${smColors.white};
  line-height: 17px;
  margin-right: 10px;
  cursor: inherit;
`;

const AddToContactsImage = styled.img`
  width: 15px;
  height: 14px;
  cursor: inherit;
`;

const Date = styled.div`
  font-size: 10px;
  font-weight: 300;
  color: ${smColors.mediumGray};
  line-height: 13px;
  margin-top: auto;
`;

type Props = {
  transaction: Tx,
  addToContacts: ({ address: string }) => void,
  isSentDisplayed: boolean,
  isReceivedDisplayed: boolean,
  isPendingDisplayed: boolean,
  isRejectedDisplayed: boolean
};

class Transaction extends PureComponent<Props> {
  render() {
    const {
      transaction: { isSent, isPending, isRejected, amount, address, date, isSavedContact },
      addToContacts,
      isSentDisplayed,
      isReceivedDisplayed,
      isPendingDisplayed,
      isRejectedDisplayed
    } = this.props;
    if (!isSentDisplayed && isSent) {
      return null;
    }
    if (!isReceivedDisplayed && !isSent) {
      return null;
    }
    if (!isPendingDisplayed && isPending) {
      return null;
    }
    if (!isRejectedDisplayed && isRejected) {
      return null;
    }
    const color = this.getColor({ isPending, isRejected });
    return (
      <Wrapper>
        <FirstSection>
          <Icon src={this.getIcon({ isSent, isPending, isRejected })} />
          <FirstSectionText>Amount</FirstSectionText>
          <FirstSectionText>{isSent ? 'To' : 'From'}</FirstSectionText>
        </FirstSection>
        <SecondSection>
          <SentReceivedTextWrapper>
            <SentReceivedText color={color}>{isSent ? 'Sent' : 'Received'}</SentReceivedText>
            {isPending && <PendingText>&nbsp;&nbsp;( Pending )</PendingText>}
            {isRejected && <RejectedText>&nbsp;&nbsp;( Rejected )</RejectedText>}
          </SentReceivedTextWrapper>
          <Amount>{amount}</Amount>
          <Address>{address}</Address>
        </SecondSection>
        <ThirdSection>
          {!isSavedContact && (
            <AddToContactsBtnWrapper>
              <AddToContactsBtn onClick={addToContacts}>
                <AddToContactsText>Add to my contacts</AddToContactsText>
                <AddToContactsImage src={addToContactsIcon} />
              </AddToContactsBtn>
            </AddToContactsBtnWrapper>
          )}
          <Date>{date}</Date>
        </ThirdSection>
      </Wrapper>
    );
  }

  getColor = ({ isPending, isRejected }: { isPending: boolean, isRejected: boolean }) => {
    if (isPending) {
      return smColors.orange;
    } else if (isRejected) {
      return smColors.red;
    }
    return smColors.darkGreen;
  };

  getIcon = ({ isSent, isPending, isRejected }: { isSent: boolean, isPending: boolean, isRejected: boolean }) => {
    if (isPending) {
      return isSent ? arrowUpOrange : arrowDownOrange;
    } else if (isRejected) {
      return isSent ? arrowUpRed : arrowDownRed;
    }
    return isSent ? arrowUpGreen : arrowDownGreen;
  };
}

export default Transaction;
