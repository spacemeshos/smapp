import React from 'react';
import styled from 'styled-components';
import {
  getAbbreviatedText,
  getAddress,
  formatSmidge,
} from '../../infra/utils';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 175px;
  height: 100%;
  padding: 10px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const Header = styled.div`
  font-weight: 800;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  margin-bottom: 15px;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  margin-bottom: 20px;
  word-break: break-all;
`;

const SubHeader = styled(Text)`
  font-weight: 800;
  margin-bottom: 5px;
`;

type Props = {
  address: string;
  fromAddress: string;
  amount: number;
  fee: number;
  note: string;
};

const TxSummary = ({ address, fromAddress, amount, fee, note }: Props) => {
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
      <SubHeader>AMOUNT</SubHeader>
      <Text>{formatSmidge(amount) || '...'}</Text>
      <SubHeader>FEE</SubHeader>
      <Text>{formatSmidge(fee) || '...'}</Text>
      <SubHeader>NOTE</SubHeader>
      <Text>{note || '...'}</Text>
    </Wrapper>
  );
};

export default TxSummary;
