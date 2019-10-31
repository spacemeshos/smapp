// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Button } from '/basicComponents';
import { getAbbreviatedText } from '/infra/utils';
import { doneIconGreen, copyToClipboard } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: ${smColors.black02Alpha};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  font-family: SourceCodeProBold;
  font-size: 42px;
  line-height: 55px;
  color: ${smColors.green};
  margin-bottom: 20px;
`;

const HeaderIcon = styled.img`
  width: 40px;
  height: 38px;
`;

const DetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 10px;
  border-bottom: ${({ isLast }) => (isLast ? 'none' : `1px solid ${smColors.black}`)};
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
    return (
      <Wrapper>
        <Header>
          <HeaderText>SMH SENT!</HeaderText>
          <HeaderIcon src={doneIconGreen} />
        </Header>
        <DetailsRow>
          <DetailsTextRight>SMH</DetailsTextRight>
          <DetailsTextLeft>{amount}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Sent from</DetailsTextRight>
          <DetailsTextLeftBold>{getAbbreviatedText(fromAddress)}</DetailsTextLeftBold>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Sent to</DetailsTextRight>
          <DetailsTextLeftBold>{getAbbreviatedText(address)}</DetailsTextLeftBold>
        </DetailsRow>
        <DetailsRow isLast>
          <DetailsTextRight>Transaction ID</DetailsTextRight>
          <ComplexText>
            <span>{getAbbreviatedText(txId, false, 8)}</span>
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
