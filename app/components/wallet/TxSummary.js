// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { getAbbreviatedText } from '/infra/utils';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 175px;
  height: 100%;
  padding: 10px 15px;
  background-color: ${smColors.black02Alpha};
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
  margin-bottom: 15px;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  margin-bottom: 20px;
  word-break: break-all;
`;

const SubHeader = styled(Text)`
  font-family: SourceCodeProBold;
  margin-bottom: 5px;
`;

type Props = {
  address: string,
  fromAddress: string,
  amount: number,
  fee: { fee: number },
  note: string
};

class TxSummary extends PureComponent<Props> {
  render() {
    const { address, fromAddress, amount, fee, note } = this.props;
    return (
      <Wrapper>
        <Header>
          Summary
          <br />
          --
        </Header>
        <SubHeader>TO</SubHeader>
        <Text>{address ? getAbbreviatedText(address, 5) : '...'}</Text>
        <SubHeader>FROM</SubHeader>
        <Text>{getAbbreviatedText(fromAddress, 5)}</Text>
        <SubHeader>SMC</SubHeader>
        <Text>{amount || '...'}</Text>
        <SubHeader>FEE</SubHeader>
        <Text>{fee || '...'}</Text>
        <SubHeader>NOTE</SubHeader>
        <Text>{note || '...'}</Text>
      </Wrapper>
    );
  }
}

export default TxSummary;
