// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SmButton } from '/basicComponents';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${smColors.darkGray};
  margin-bottom: 15px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  border-top: 1px solid ${smColors.orange};
  border-left: 1px solid ${smColors.orange};
  border-right: 1px solid ${smColors.orange};
  border-radius: 2px;
`;

const UpperSection = styled.div`
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid ${smColors.borderGray};
  font-size: 14px;
  line-height: 19px;
  color: ${smColors.darkGray50Alpha};
`;

const TotalAmount = styled.div`
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  color: ${smColors.darkGray};
  margin-bottom: 5px;
`;

const TotalAmountInFiat = styled.div`
  font-weight: 16px;
  line-height: 22px;
  color: ${smColors.darkGray50Alpha};
`;

type Props = {
  amount: number,
  fee: { fee: number },
  fiatRate: number,
  sendTransaction: () => void
};

class TxTotal extends PureComponent<Props> {
  render() {
    const { amount, fee, fiatRate, sendTransaction } = this.props;
    return (
      <Wrapper>
        <Header>Total</Header>
        <InnerWrapper>
          <UpperSection>
            <div>{amount} SMC</div>
            <div>+ {fee.fee} SMC fee</div>
          </UpperSection>
          <div>
            <TotalAmount>{amount + fee.fee}</TotalAmount>
            <TotalAmountInFiat>~ {(amount + fee.fee) * fiatRate} USD</TotalAmountInFiat>
          </div>
        </InnerWrapper>
        <SmButton text="Send" theme="orange" onPress={sendTransaction} />
      </Wrapper>
    );
  }
}

export default TxTotal;
