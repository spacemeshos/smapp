import React from 'react';
import styled from 'styled-components';
import { SecondaryButton, Link, Button } from '../../basicComponents';
import { getAddress, formatSmidge } from '../../infra/utils';
import { chevronLeftWhite } from '../../assets/images';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha)};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const SubHeader1 = styled(HeaderText)`
  margin-bottom: 15px;
`;

const SubHeader2 = styled.div`
  margin-bottom: 20px;
  font-family: SourceCodeProBold;
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
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

const TotalText = styled.div`
  font-family: SourceCodeProBold;
  font-size: 24px;
  line-height: 30px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const ComplexButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-right: 10px;
`;

const ComplexButtonText = styled.div`
  margin-left: 10px;
  font-size: 13px;
  line-height: 17px;
  text-decoration: underline;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.mediumGray)};
`;

type Props = {
  fromAddress: string;
  address: string;
  amount: string;
  fee: string;
  note: string;
  doneAction: () => void;
  editTx: () => void;
  cancelTx: () => void;
};

const TxConfirmation = ({ fromAddress, address, amount, fee, note, doneAction, editTx, cancelTx }: Props) => {
  const navigateToGuide = () => window.open('https://testnet.spacemesh.io/#/send_coin');
  const { value, unit }: any = formatSmidge(amount, true);
  return (
    <Wrapper>
      <Header>
        <HeaderText>Send SMH</HeaderText>
        <Link onClick={cancelTx} text="CANCEL TRANSACTION" style={{ color: smColors.orange }} />
      </Header>
      <SubHeader1>--</SubHeader1>
      <SubHeader2>SUMMARY</SubHeader2>
      <>
        <DetailsRow>
          <DetailsTextRight>Sent from</DetailsTextRight>
          <DetailsTextLeft>{`0x${getAddress(fromAddress)}`}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Sent to</DetailsTextRight>
          <DetailsTextLeft>{`0x${address}`}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Note</DetailsTextRight>
          <DetailsTextLeft>{note || '---'}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>{unit}</DetailsTextRight>
          <DetailsTextLeft>{value}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Fee</DetailsTextRight>
          <DetailsTextLeft>{formatSmidge(fee)}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Total</DetailsTextRight>
          <TotalText>{formatSmidge(amount + fee)}</TotalText>
        </DetailsRow>
      </>
      <Footer>
        <ComplexButton>
          <SecondaryButton onClick={editTx} img={chevronLeftWhite} imgWidth={10} imgHeight={15} />
          <ComplexButtonText>EDIT TRANSACTION</ComplexButtonText>
        </ComplexButton>
        <Link onClick={navigateToGuide} text="SEND SMH GUIDE" />
        <Button onClick={doneAction} text="SEND" style={{ marginLeft: 'auto' }} />
      </Footer>
    </Wrapper>
  );
};

export default TxConfirmation;
