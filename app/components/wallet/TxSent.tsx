import React from 'react';
import styled from 'styled-components';
import { Link, Button } from '../../basicComponents';
import { getAddress, formatSmidge } from '../../infra/utils';
import { fireworksImg, doneIconGreen } from '../../assets/images';
import { smColors } from '../../vars';
import Address, { AddressType } from '../common/Address';
import { ExternalLinks } from '../../../shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background: url(${fireworksImg}) center center no-repeat;
  background-size: contain;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HeaderText = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.green};
  text-transform: uppercase;
`;

const HeaderIcon = styled.img`
  width: 30px;
  height: 29px;
  margin-top: auto;
`;

const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid ${smColors.navLinkGrey};
  &:last-child {
    border-bottom: none;
  }
`;

const DetailsTextRight = styled.div`
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const DetailsTextLeft = styled(DetailsTextRight)`
  margin-right: 0;
  text-align: right;
`;

const DetailsTextLeftBold = styled(DetailsTextLeft)`
  font-weight: 800;
`;

const ComplexText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const ButtonsBlock = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {
  fromAddress: string;
  address: string;
  amount: number;
  txId: string;
  doneAction: () => void;
  navigateToTxList: () => void;
};

const TxSent = ({
  fromAddress,
  address,
  amount,
  txId,
  doneAction,
  navigateToTxList,
}: Props) => {
  const navigateToGuide = () => window.open(ExternalLinks.SendCoinGuide);

  const { unit }: any = formatSmidge(amount, true);
  return (
    <Wrapper>
      <Header>
        <HeaderText>{unit} SENT!</HeaderText>
        <HeaderIcon src={doneIconGreen} />
      </Header>
      <>
        <DetailsRow>
          <DetailsTextRight>Amount</DetailsTextRight>
          <DetailsTextLeft>{formatSmidge(amount)}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>From</DetailsTextRight>
          <DetailsTextLeftBold>{`0x${getAddress(
            fromAddress
          )}`}</DetailsTextLeftBold>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>To</DetailsTextRight>
          <DetailsTextLeftBold>{address}</DetailsTextLeftBold>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Transaction ID</DetailsTextRight>
          <ComplexText>
            <DetailsTextLeft>
              <Address address={txId} type={AddressType.TX} />
            </DetailsTextLeft>
          </ComplexText>
        </DetailsRow>
      </>
      <Footer>
        <Link onClick={navigateToGuide} text="SEND SMH GUIDE" />
        <ButtonsBlock>
          <Button
            onClick={navigateToTxList}
            text="VIEW TRANSACTION"
            isPrimary={false}
            width={170}
            style={{ marginRight: 20 }}
          />
          <Button onClick={doneAction} text="DONE" />
        </ButtonsBlock>
      </Footer>
    </Wrapper>
  );
};

export default TxSent;
