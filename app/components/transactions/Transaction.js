// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { chevronLeftBlack, chevronRightBlack } from '/assets/images';
import { getAbbreviatedText } from '/infra/utils';
import { smColors } from '/vars';
import type { Tx } from '/types';

const getDateText = (date: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString('en-US', options)} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Icon = styled.img`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.darkGray};
`;

const NickName = styled(Text)`
  color: ${smColors.realBlack};
`;

const Amount = styled.div`
  color: ${({ color }) => color};
`;

type Props = {
  transaction: Tx,
  isSentDisplayed?: boolean,
  isReceivedDisplayed?: boolean,
  isPendingDisplayed?: boolean,
  isRejectedDisplayed?: boolean
};

class Transaction extends PureComponent<Props> {
  static defaultProps = {
    isSentDisplayed: true,
    isReceivedDisplayed: true,
    isPendingDisplayed: true,
    isRejectedDisplayed: true
  };

  render() {
    const {
      transaction: { isSent, isPending, isRejected, amount, address, date, isSavedContact, nickname },
      isSentDisplayed,
      isReceivedDisplayed,
      isPendingDisplayed,
      isRejectedDisplayed
    } = this.props;
    if ((!isSentDisplayed && isSent) || (!isReceivedDisplayed && !isSent) || (!isPendingDisplayed && isPending) || (!isRejectedDisplayed && isRejected)) {
      return null;
    }
    const color = this.getColor({ isSent, isPending, isRejected });
    const txId = '1723d...7293'; // TODO change to real tx id
    return (
      <Wrapper>
        <Icon src={isSent ? chevronLeftBlack : chevronRightBlack} />
        <MainWrapper>
          <Section>
            <NickName>{isSavedContact ? nickname : getAbbreviatedText(address)}</NickName>
            <Text>{txId}</Text>
          </Section>
          <Section>
            <Text>{getDateText(date)}</Text>
            <Amount color={color}>{amount}</Amount>
          </Section>
        </MainWrapper>
      </Wrapper>
    );
  }

  getColor = ({ isSent, isPending, isRejected }: { isSent: boolean, isPending: boolean, isRejected: boolean }) => {
    if (isPending) {
      return smColors.orange;
    } else if (isRejected) {
      return smColors.orange;
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };
}

export default Transaction;
