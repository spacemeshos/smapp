// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { getAbbreviatedText, getAddress, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 175px;
  height: 100%;
  padding: 10px 15px;
  background-color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dmBlack2 : smColors.black02Alpha)};
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
  margin-bottom: 15px;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
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
    let value = 0;
    let unit = 'SMH';
    if (amount) {
      ({ value, unit } = formatSmidge(amount, true));
    }
    return (
      <Wrapper>
        <Header>
          Summary
          <br />
          --
        </Header>
        <SubHeader>TO</SubHeader>
        <Text>{address ? getAbbreviatedText(address) : '...'}</Text>
        <SubHeader>FROM</SubHeader>
        <Text>{getAbbreviatedText(getAddress(fromAddress))}</Text>
        <SubHeader>{unit}</SubHeader>
        <Text>{value || '...'}</Text>
        <SubHeader>FEE</SubHeader>
        <Text>{fee || '...'}</Text>
        <SubHeader>NOTE</SubHeader>
        <Text>{note || '...'}</Text>
      </Wrapper>
    );
  }
}

export default TxSummary;
