// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Button } from '/basicComponents';
import { getAbbreviatedText, getAddress, formatSmidge } from '/infra/utils';
import { fireworksImg, doneIconGreen, copyToClipboard } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background: url(${fireworksImg}) center center no-repeat;
  background-size: contain;
  background-color: ${smColors.black02Alpha};
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
  border-bottom: ${({ isLast }) => (isLast ? 'none' : `1px solid ${smColors.navLinkGrey}`)};
`;

const DetailsTextRight = styled.div`
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
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
  fromAddress: string,
  address: string,
  amount: string,
  txId: string,
  doneAction: () => void,
  navigateToTxList: () => void
};

type State = {
  isCopied: boolean
};

class TxSent extends Component<Props, State> {
  state = {
    isCopied: false
  };

  render() {
    const { fromAddress, address, amount, txId, doneAction, navigateToTxList } = this.props;
    const { isCopied } = this.state;
    const { value, unit } = formatSmidge(amount, true);
    return (
      <Wrapper>
        <Header>
          <HeaderText>{unit} SENT!</HeaderText>
          <HeaderIcon src={doneIconGreen} />
        </Header>
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
        <DetailsRow isLast>
          <DetailsTextRight>Transaction ID</DetailsTextRight>
          <ComplexText>
            <span>{getAbbreviatedText(txId, true, 8)}</span>
            <CopyIcon src={copyToClipboard} onClick={this.copyTxId} />
          </ComplexText>
        </DetailsRow>
        {isCopied && <CopiedText>Tx ID copied to clipboard!</CopiedText>}
        <Footer>
          <Link onClick={this.navigateToGuide} text="SEND SMH GUIDE" />
          <ButtonsBlock>
            <Button onClick={navigateToTxList} text="VIEW TRANSACTION" isPrimary={false} width={170} style={{ marginRight: 20 }} />
            <Button onClick={doneAction} text="DONE" />
          </ButtonsBlock>
        </Footer>
      </Wrapper>
    );
  }

  copyTxId = () => {
    const { txId } = this.props;
    clipboard.writeText(txId);
    this.setState({ isCopied: true });
  };

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/send_coin');
}

export default TxSent;
