// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTransaction } from '/redux/wallet/actions';
import { chevronLeftBlack, chevronRightBlack, addContact } from '/assets/images';
import styled from 'styled-components';
import { Button } from '/basicComponents';
import { getAbbreviatedText, getFormattedTimestamp, getAddress } from '/infra/utils';
import { smColors } from '/vars';
import TX_STATUSES from '/vars/enums';
import type { Tx, Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) => (isDetailed ? `background-color: ${smColors.disabledGray};` : 'cursor: pointer;')}
  border-bottom: 1px solid ${smColors.disabledGray};
`;

const RowWrapper = styled.div`
  display: flex;
  height: 48px;
  flex-direction: row;
  &:hover {
    background-color: ${smColors.disabledGray};
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
  color: ${smColors.darkGray50Alpha};
`;

const BlackText = styled(Text)`
  color: ${smColors.realBlack};
`;

const Dots = styled(Text)`
  flex-shrink: 1;
  overflow: hidden;
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  color: ${({ color }) => color};
`;

const DarkGrayText = styled(Text)`
  color: ${smColors.darkGray};
`;

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

const TextArea = styled.textarea`
  flex: 1;
  height: ${({ rows }) => rows * 16 + 16}px;
  padding: 8px 10px;
  border-radius: 0;
  border: none;
  color: ${smColors.black};
  font-size: 14px;
  line-height: 16px;
  outline: none;
  resize: none;
  border: 1px solid ${smColors.black};
  margin-bottom: 10px;
`;

type Props = {
  updateTransaction: Action,
  tx: Tx,
  publicKey: string,
  addAddressToContacts: ({ address: string }) => void
};

type State = {
  isDetailed: boolean,
  note: string
};

class TransactionRow extends Component<Props, State> {
  statuses: Array<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      isDetailed: false,
      note: props.tx.note
    };
    this.statuses = Object.keys(TX_STATUSES);
  }

  render() {
    const {
      tx: { txId, sender, status, amount, fee, timestamp, layerId, nickname },
      publicKey
    } = this.props;
    const { isDetailed, note } = this.state;
    const isSent = sender === getAddress(publicKey);
    const color = this.getColor({ status, isSent });
    const detailRows =
      txId === 'reward'
        ? [
            { title: 'TRANSACTION ID', value: 'Smeshing reward' },
            { title: 'STATUS', value: this.statuses[status], color },
            { title: 'LAYER ID', value: layerId },
            { title: 'TO', value: 'Me' },
            { title: 'VALUE', value: `${amount} SMG` }
          ]
        : [
            { title: 'TRANSACTION ID', value: txId === 'reward' ? 'Smeshing reward' : getAbbreviatedText(txId) },
            { title: 'STATUS', value: this.statuses[status], color },
            { title: 'LAYER ID', value: layerId },
            { title: 'FROM', value: isSent ? 'Me' : getAbbreviatedText(sender) },
            { title: 'TO', value: isSent ? getAbbreviatedText(sender) : 'Me' },
            { title: 'VALUE', value: `${amount} SMG` },
            { title: 'TRANSACTION FEE', value: `${fee || 0} SMG` }
          ];
    return (
      <Wrapper isDetailed={isDetailed}>
        <RowWrapper onClick={this.toggleTxDetails}>
          <Icon src={isSent ? chevronLeftBlack : chevronRightBlack} />
          <MainWrapper>
            <Section>
              {nickname && <DarkGrayText>{nickname.toUpperCase()}</DarkGrayText>}
              <Text>{getAbbreviatedText(txId)}</Text>
            </Section>
            <Section>
              <Amount color={color}>{amount} SMH</Amount>
              <DarkGrayText>{getFormattedTimestamp(timestamp)}</DarkGrayText>
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
                  <BoldText
                    color={detailRow.color || smColors.realBlack}
                    onClick={detailRow.title === 'TO' || detailRow.title === 'FROM' ? () => clipboard.writeText(detailRow.value) : null}
                  >
                    {detailRow.value} {!nickname && this.renderAddToContactIcon({ isSent, title: detailRow.title })}
                  </BoldText>
                </TextRow>
              ))}
            </LeftDetails>
            <RightDetails>
              <BlackText style={{ marginBottom: 4 }}>Note</BlackText>
              <TextArea
                type="text"
                numberOfLines={5}
                value={note}
                placeholder="Enter a note"
                onChange={({ target }: { target: { value: string } }) => {
                  const { value } = target;
                  this.setState({ note: value });
                }}
                maxLength="50"
              />
              <Button onClick={this.save} text="SAVE" style={{ alignSelf: 'flex-end' }} />
            </RightDetails>
          </DetailsSection>
        )}
      </Wrapper>
    );
  }

  renderAddToContactIcon = ({ isSent, title }: { isSent: boolean, title: string }) => {
    const isFieldToOrFrom = (isSent && title === 'TO') || (!isSent && title === 'FROM');
    return isFieldToOrFrom && <AddToContactsImg onClick={this.handleAddToContacts} src={addContact} />;
  };

  getColor = ({ status, isSent }: { status: string, isSent: boolean }) => {
    if (status === TX_STATUSES.PENDING) {
      return smColors.orange;
    } else if (status === TX_STATUSES.REJECTED) {
      return smColors.orange;
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };

  handleAddToContacts = (event: Event) => {
    event.stopPropagation();
    const {
      tx: { address },
      addAddressToContacts
    } = this.props;
    addAddressToContacts({ address });
  };

  save = async () => {
    const { tx, updateTransaction } = this.props;
    const { note } = this.state;
    try {
      await updateTransaction({ tx: { ...tx, note } });
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

const mapDispatchToProps = {
  updateTransaction
};

TransactionRow = connect<any, any, _, _, _, _>(null, mapDispatchToProps)(TransactionRow);

export default TransactionRow;
