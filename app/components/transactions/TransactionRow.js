// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTransaction } from '/redux/wallet/actions';
import { chevronLeftBlack, chevronRightBlack, addContact } from '/assets/images';
import styled from 'styled-components';
import { Input, Button } from '/basicComponents';
import { getAbbreviatedText } from '/infra/utils';
import { smColors } from '/vars';
import type { Tx, Action } from '/types';

const getDateText = (date: string) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateObj = new Date(date);
  const localeDateString = dateObj.toLocaleDateString('en-US', options);
  return `${localeDateString.replace(',', '')} - ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
};

const getTxStatus = ({ isPending, isRejected }: { isPending: boolean, isRejected: boolean }) => {
  if (isRejected) {
    return 'REJECTED';
  }
  if (isPending) {
    return 'PENDING';
  }
  return 'SUCCESS';
};

const getColor = ({ isSent, isPending, isRejected }: { isSent: boolean, isPending: boolean, isRejected: boolean }) => {
  if (isPending) {
    return smColors.textGray;
  } else if (isRejected) {
    return smColors.darkGray;
  }
  return isSent ? smColors.green : smColors.orange;
};

// $FlowStyledIssue
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) =>
    isDetailed &&
    `
    background-color: ${smColors.mediumLightGray};  
  `}
  border-bottom: 1px solid ${smColors.mediumLightGray};
`;

// $FlowStyledIssue
const RowWrapper = styled.div`
  display: flex;
  height: 48px;
  flex-direction: row;
  &:hover {
    background-color: ${smColors.mediumLightGray};
  }
  padding-top: 6px;
  padding-right: 12px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.span`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.darkGray80Alpha};
`;

const BlackText = styled(Text)`
  color: ${smColors.realBlack};
`;

const Dots = styled(Text)`
  flex-shrink: 1;
  overflow: hidden;
`;

// $FlowStyledIssue
const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  color: ${({ color }) => color};
`;

const DarkGrayText = styled(Text)`
  color: ${smColors.textGray};
`;

// $FlowStyledIssue
const Amount = styled.div`
  text-align: right;
  color: ${({ color }) => color};
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 6px 12px 12px 20px;
`;

const LeftDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
  margin-right: 60px;
`;

const RightDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TextRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 10px;
`;

const AddToContactsImg = styled.img`
  width: 14px;
  height: 12px;
  cursor: pointer;
  margin-left: 4px;
`;

type Props = {
  updateTransaction: Action,
  transaction: Tx,
  fiatRate: number,
  addAddressToContacts: ({ address: string }) => void
};

type State = {
  isDetailed: boolean,
  note: string
};

class TransactionRow extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isDetailed: false,
      note: props.transaction.note
    };
  }

  render() {
    const { isDetailed, note } = this.state;
    const {
      transaction: { isSent, isPending, isRejected, amount, address, date, isSavedContact, nickname },
      fiatRate
    } = this.props;
    const color = getColor({ isSent, isPending, isRejected });
    const txId = '1723d...7293'; // TODO change to real tx id
    const detailRows = [
      { title: 'TRANSACTION ID', value: txId },
      { title: 'STATUS', value: getTxStatus({ isPending, isRejected }), color: getColor({ isSent, isPending, isRejected }) },
      { title: 'BLOCK', value: 7701538 }, // TODO: needs real value
      { title: 'FROM', value: isSent ? 'Me' : getAbbreviatedText(address) },
      { title: 'TO', value: isSent ? getAbbreviatedText(address) : 'Me' },
      { title: 'VALUE', value: `$${amount * fiatRate}` },
      { title: 'TRANSACTION FEE', value: 0.03 } // TODO: needs real value
    ];
    return (
      <Wrapper isDetailed={isDetailed}>
        <RowWrapper onClick={this.toggleTxDetails}>
          <Icon src={isSent ? chevronLeftBlack : chevronRightBlack} />
          <MainWrapper>
            <Section>
              <DarkGrayText>
                {isSavedContact ? nickname.toUpperCase() : 'UNKNOWN'}
                {!isSavedContact && <AddToContactsImg onClick={this.handleAddToContacts} src={addContact} />}
              </DarkGrayText>
              <Text>{txId}</Text>
            </Section>
            <Section>
              <Amount color={color}>{amount}</Amount>
              <DarkGrayText>{getDateText(date)}</DarkGrayText>
            </Section>
          </MainWrapper>
        </RowWrapper>
        {isDetailed && (
          <DetailsSection>
            <LeftDetails>
              {detailRows.map((detailRow) => (
                <TextRow key={detailRow.title}>
                  <BlackText>{detailRow.title}</BlackText>
                  <Dots>...............</Dots>
                  <BoldText color={detailRow.color || smColors.realBlack}>{detailRow.value}</BoldText>
                </TextRow>
              ))}
            </LeftDetails>
            <RightDetails>
              <BlackText style={{ marginBottom: 4 }}>Note</BlackText>
              <Input
                numberOfLines={5}
                value={note}
                placeholder="Enter a note"
                onChange={({ value }) => this.setState({ note: value })}
                maxLength="50"
                style={{ marginBottom: 10 }}
              />
              <Button onClick={this.save} text="SAVE" style={{ alignSelf: 'flex-end' }} />
            </RightDetails>
          </DetailsSection>
        )}
      </Wrapper>
    );
  }

  handleAddToContacts = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    const {
      transaction: { address },
      addAddressToContacts
    } = this.props;
    addAddressToContacts({ address });
  };

  save = async () => {
    const { transaction, updateTransaction } = this.props;
    const { note } = this.state;
    try {
      await updateTransaction({ tx: { ...transaction, note } });
      this.setState({ isDetailed: false });
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  toggleTxDetails = () => {
    const { isDetailed } = this.state;
    this.setState({ isDetailed: !isDetailed });
  };
}

const mapStateToProps = (state) => ({
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  updateTransaction
};

TransactionRow = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(TransactionRow);

export default TransactionRow;
