// @flow
import { shell } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SecondaryButton, Link, Button } from '/basicComponents';
import { getAbbreviatedText, smgToSmesh } from '/infra/utils';
import { chevronLeftWhite } from '/assets/images';
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
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const SubHeader1 = styled(HeaderText)`
  margin-bottom: 15px;
`;

const SubHeader2 = styled.div`
  font-family: SourceCodeProBold;
  font-size: 24px;
  line-height: 30px;
  color: ${smColors.black};
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

const TotalText = styled.div`
  font-family: SourceCodeProBold;
  font-size: 24px;
  line-height: 30px;
  color: ${smColors.black};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const ComplexButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const ComplexButtonText = styled.div`
  margin-left: 10px;
  font-size: 13px;
  line-height: 17px;
  text-decoration: underline;
  color: ${smColors.mediumGray};
`;

type Props = {
  fromAddress: string,
  address: string,
  amount: string,
  fee: number,
  note: string,
  doneAction: () => void,
  editTx: () => void,
  cancelTx: () => void,
  isConnected: boolean
};

class TxConfirmation extends PureComponent<Props> {
  render() {
    const { fromAddress, address, amount, fee, note, doneAction, editTx, cancelTx, isConnected } = this.props;
    return (
      <Wrapper>
        <Header>
          <HeaderText>Send SMH</HeaderText>
          <Link onClick={cancelTx} text="CANCEL TRANSACTION" style={{ color: smColors.orange }} />
        </Header>
        <SubHeader1>--</SubHeader1>
        <SubHeader2>SUMMARY</SubHeader2>
        <DetailsRow>
          <DetailsTextRight>Sent from</DetailsTextRight>
          <DetailsTextLeft>{getAbbreviatedText(fromAddress)}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Sent to</DetailsTextRight>
          <DetailsTextLeft>{getAbbreviatedText(address)}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Note</DetailsTextRight>
          <DetailsTextLeft>{note || '---'}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>SMH</DetailsTextRight>
          <DetailsTextLeft>{amount}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow>
          <DetailsTextRight>Shmkl fee</DetailsTextRight>
          <DetailsTextLeft>{fee}</DetailsTextLeft>
        </DetailsRow>
        <DetailsRow isLast>
          <DetailsTextRight>Total</DetailsTextRight>
          <TotalText>{amount + parseFloat(smgToSmesh(fee).toFixed(4))}</TotalText>
        </DetailsRow>
        <Footer>
          <ComplexButton>
            <SecondaryButton onClick={editTx} img={chevronLeftWhite} imgWidth={10} imgHeight={15} />
            <ComplexButtonText>EDIT TRANSACTION</ComplexButtonText>
          </ComplexButton>
          <Link onClick={this.navigateToGuide} text="SEND SMH GUIDE" />
          <Button onClick={doneAction} text="SEND" isDisabled={!isConnected} />
        </Footer>
      </Wrapper>
    );
  }

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/send_coin');
}

export default TxConfirmation;
