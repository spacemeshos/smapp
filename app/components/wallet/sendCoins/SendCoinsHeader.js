// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid ${smColors.borderGray};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  font-size: 31px;
  line-height: 42px;
  font-weight: bold;
`;

const HeaderTextLeft = styled(HeaderText)`
  color: ${smColors.lighterBlack};
`;

const HeaderTextRight = styled(HeaderText)`
  font-size: 31px;
  line-height: 42px;
  font-weight: bold;
  color: ${smColors.gray};
`;

const SubHeaderText = styled.div`
  font-size: 16px;
  line-header: 30px;
`;

const SubHeaderLeft = styled(SubHeaderText)`
  display: flex;
  flex-direction: row;
  color: ${smColors.darkGray50Alpha};
`;

const Balance = styled.span`
  font-weight: bold;
  color: ${smColors.lighterBlack};
`;

const FiatValue = styled.span`
  color: ${smColors.gray};
`;

const SubHeaderRight = styled(SubHeaderText)`
  color: ${smColors.darkGreen};
  cursor: pointer;
`;

type Props = {
  fiatRate: number,
  balance: number,
  navigateToTxExplanation: () => void
};

class SendCoinsHeader extends PureComponent<Props> {
  render() {
    const { fiatRate, balance, navigateToTxExplanation } = this.props;
    return (
      <Wrapper>
        <TextWrapper style={{ marginBottom: 40 }}>
          <HeaderTextLeft>Send Spacemesh Coins (SMC)</HeaderTextLeft>
          <HeaderTextRight>1 SMC = ${fiatRate}</HeaderTextRight>
        </TextWrapper>
        <TextWrapper>
          <SubHeaderLeft>
            Available in wallet:&nbsp;<Balance>{balance} SMC</Balance>
            <FiatValue>&nbsp;= {balance * fiatRate} USD</FiatValue>
          </SubHeaderLeft>
          <SubHeaderRight onClick={navigateToTxExplanation}>Learn more about Spacemesh transactions</SubHeaderRight>
        </TextWrapper>
      </Wrapper>
    );
  }
}

export default SendCoinsHeader;
