import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, Button } from '../../basicComponents';
import { getAbbreviatedText, getAddress, formatSmidge } from '../../infra/utils';
import { fireworksImg, doneIconGreen, copyBlack, copyWhite } from '../../assets/images';
import { smColors } from '../../vars';
import { eventsService } from '../../infra/eventsService';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background: url(${fireworksImg}) center center no-repeat;
  background-size: contain;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha)};
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
  font-family: SourceCodeProBold;
`;

const ComplexText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CopyIcon = styled.img`
  width: 14px;
  height: 15px;
  margin-left: 10px;
  cursor: pointer;
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

const CopiedText = styled.div`
  margin-left: auto;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.green};
`;

type Props = {
  fromAddress: string;
  address: string;
  amount: string;
  txId: string;
  isDarkMode: boolean;
  doneAction: () => void;
  navigateToTxList: () => void;
};

const TxSent = ({ fromAddress, address, amount, txId, isDarkMode, doneAction, navigateToTxList }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyTxId = async () => {
    await navigator.clipboard.writeText(txId);
    setIsCopied(true);
  };

  const copyIcon = isDarkMode ? copyWhite : copyBlack;

  const navigateToGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/send_coin' });

  const { value, unit }: any = formatSmidge(amount, true);
  return (
    <Wrapper>
      <Header>
        <HeaderText>{unit} SENT!</HeaderText>
        <HeaderIcon src={doneIconGreen} />
      </Header>
      <>
        <DetailsRow>
          <DetailsTextRight>{unit}</DetailsTextRight>
          <DetailsTextLeft>{value}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Sent from</DetailsTextRight>
          <DetailsTextLeftBold>{`0x${getAddress(fromAddress)}`}</DetailsTextLeftBold>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Sent to</DetailsTextRight>
          <DetailsTextLeftBold>{`0x${address}`}</DetailsTextLeftBold>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Transaction ID</DetailsTextRight>
          <ComplexText>
            <DetailsTextLeft>{getAbbreviatedText(txId, true, 8)}</DetailsTextLeft>
            <CopyIcon src={copyIcon} onClick={copyTxId} />
          </ComplexText>
        </DetailsRow>
      </>
      {isCopied && <CopiedText>Tx ID copied to clipboard!</CopiedText>}
      <Footer>
        <Link onClick={navigateToGuide} text="SEND SMH GUIDE" />
        <ButtonsBlock>
          <Button onClick={navigateToTxList} text="VIEW TRANSACTION" isPrimary={false} width={170} style={{ marginRight: 20 }} />
          <Button onClick={doneAction} text="DONE" />
        </ButtonsBlock>
      </Footer>
    </Wrapper>
  );
};

export default TxSent;
