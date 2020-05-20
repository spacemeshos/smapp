// @flow
import { clipboard } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTransaction } from '/redux/wallet/actions';
import { chevronLeftBlack, chevronRightBlack, addContact } from '/assets/images';
import styled from 'styled-components';
import { Button } from '/basicComponents';
import { getAbbreviatedText, getFormattedTimestamp, getAddress, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';
import TX_STATUSES from '/vars/enums';
import type { Tx, Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) => isDetailed && `background-color: ${smColors.disabledGray};`}
  border-bottom: 1px solid ${smColors.disabledGray};
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 0 15px;
  cursor: pointer;
  &:hover {
    background-color: ${smColors.disabledGray};
  }
`;

const Icon = styled.img`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;

const HeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;
  cursor: inherit;
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
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
  cursor: inherit;
`;

const Amount = styled.div`
  text-align: right;
  color: ${({ color }) => color};
  cursor: inherit;
`;

const CopiedBanner = styled.div`
  position: absolute;
  left: 48%;
  top: 15px;
  font-size: 15px;
  line-height: 20px;
  color: ${smColors.darkerGreen};
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

const formatTxId = (id) => id && `0x${id.substring(0, 6)}`;

type Props = {
  updateTransaction: Action,
  tx: Tx,
  publicKey: string,
  addAddressToContacts: ({ address: string }) => void
};

type State = {
  isDetailed: boolean,
  note: string,
  wasCopied: boolean
};

class TransactionRow extends Component<Props, State> {
  statuses: Array<string>;

  constructor(props: Props) {
    super(props);
    this.state = {
      isDetailed: false,
      note: props.tx.note,
      wasCopied: false
    };
    this.statuses = Object.keys(TX_STATUSES);
  }

  render() {
    const {
      tx: { txId, sender, status, amount, timestamp, nickname },
      publicKey
    } = this.props;
    const { isDetailed, wasCopied } = this.state;
    const isSent = sender === getAddress(publicKey);
    const color = this.getColor({ status, isSent });
    return (
      <Wrapper isDetailed={isDetailed}>
        <Header onClick={this.toggleTxDetails}>
          <Icon src={isSent ? chevronRightBlack : chevronLeftBlack} />
          <HeaderInner>
            <HeaderSection>
              {txId === 'reward' ? (
                <DarkGrayText>SMESHING REWARD</DarkGrayText>
              ) : (
                [nickname && <DarkGrayText key="nickname">{nickname.toUpperCase()}</DarkGrayText>, <Text key={txId}>{formatTxId(txId)}</Text>]
              )}
            </HeaderSection>
            <HeaderSection>
              <Amount color={color}>{`${isSent ? '-' : '+'}${formatSmidge(amount)}`}</Amount>
              <DarkGrayText>{getFormattedTimestamp(timestamp)}</DarkGrayText>
            </HeaderSection>
            {wasCopied && <CopiedBanner>Copied!</CopiedBanner>}
          </HeaderInner>
        </Header>
        {isDetailed && this.renderDetails()}
      </Wrapper>
    );
  }

  renderDetails = () => {
    const {
      tx,
      tx: { txId, nickname, status, color, layerId, sender, receiver, amount, fee },
      publicKey
    } = this.props;
    const isSent = sender === getAddress(publicKey);
    const { note } = this.state;
    if (txId === 'reward') {
      return (
        <DetailsSection>
          <LeftDetails>
            <TextRow>
              <BlackText>STATUS</BlackText>
              <Dots>............</Dots>
              <BoldText color={color}>{this.statuses[status]}</BoldText>
            </TextRow>
            {layerId ? (
              <TextRow>
                <BlackText>LAYER ID</BlackText>
                <Dots>............</Dots>
                <BoldText color={smColors.realBlack}>{layerId}</BoldText>
              </TextRow>
            ) : null}
            <TextRow>
              <BlackText>TO</BlackText>
              <Dots>............</Dots>
              <BoldText color={smColors.realBlack}>ME</BoldText>
            </TextRow>
            <TextRow>
              <BlackText>SMESHING REWARD</BlackText>
              <Dots>............</Dots>
              <BoldText color={smColors.realBlack}>{formatSmidge(amount)}</BoldText>
            </TextRow>
            <TextRow>
              <BlackText>SMESHING FEE REWARD</BlackText>
              <Dots>............</Dots>
              <BoldText color={smColors.realBlack}>{formatSmidge(fee || 0)}</BoldText>
            </TextRow>
          </LeftDetails>
          <RightDetails />
        </DetailsSection>
      );
    }
    return (
      <DetailsSection>
        <LeftDetails>
          <TextRow>
            <BlackText>TRANSACTION ID</BlackText>
            <Dots>............</Dots>
            <BoldText color={smColors.realBlack} onClick={() => this.copyAddress({ id: txId })}>
              {formatTxId(txId)}
            </BoldText>
          </TextRow>
          <TextRow>
            <BlackText>STATUS</BlackText>
            <Dots>............</Dots>
            <BoldText color={color}>{this.statuses[status]}</BoldText>
          </TextRow>
          {layerId ? (
            <TextRow>
              <BlackText>LAYER ID</BlackText>
              <Dots>............</Dots>
              <BoldText color={smColors.realBlack}>{layerId}</BoldText>
            </TextRow>
          ) : null}
          <TextRow>
            <BlackText>FROM</BlackText>
            <Dots>............</Dots>
            <BoldText color={smColors.realBlack} onClick={!isSent ? () => this.copyAddress({ id: sender }) : null}>
              {isSent ? `${getAbbreviatedText(getAddress(publicKey))} (Me)` : nickname || getAbbreviatedText(sender)}
              {!isSent && !nickname && <AddToContactsImg onClick={(e) => this.handleAddToContacts(e, sender)} src={addContact} />}
            </BoldText>
          </TextRow>
          <TextRow>
            <BlackText>TO</BlackText>
            <Dots>............</Dots>
            <BoldText color={smColors.realBlack} onClick={isSent ? () => this.copyAddress({ id: receiver }) : null}>
              {isSent ? nickname || getAbbreviatedText(receiver) : `${getAbbreviatedText(getAddress(publicKey))} (Me)`}
              {isSent && !nickname && <AddToContactsImg onClick={(e) => this.handleAddToContacts(e, receiver)} src={addContact} />}
            </BoldText>
          </TextRow>
          <TextRow>
            <BlackText>VALUE</BlackText>
            <Dots>............</Dots>
            <BoldText color={smColors.realBlack}>{formatSmidge(amount)}</BoldText>
          </TextRow>
          <TextRow>
            <BlackText>TRANSACTION FEE</BlackText>
            <Dots>............</Dots>
            <BoldText color={smColors.realBlack}>{formatSmidge(fee || 0)}</BoldText>
          </TextRow>
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
          {note !== tx.note && <Button onClick={this.save} text="SAVE" style={{ alignSelf: 'flex-end' }} />}
        </RightDetails>
      </DetailsSection>
    );
  };

  getColor = ({ status, isSent }: { status: string, isSent: boolean }) => {
    if (status === TX_STATUSES.PENDING) {
      return smColors.orange;
    } else if (status === TX_STATUSES.REJECTED) {
      return smColors.orange;
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };

  handleAddToContacts = (event: Event, address: string) => {
    event.stopPropagation();
    const { addAddressToContacts } = this.props;
    addAddressToContacts({ address });
  };

  save = async () => {
    const { tx, updateTransaction } = this.props;
    const { note } = this.state;
    try {
      updateTransaction({ newData: { note }, txId: tx.txId });
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

  copyAddress = ({ id }: { id: string }) => {
    clipboard.writeText(`0x${id}`);
    this.setState({ wasCopied: true });
  };
}

const mapDispatchToProps = {
  updateTransaction
};

TransactionRow = connect<any, any, _, _, _, _>(null, mapDispatchToProps)(TransactionRow);

export default TransactionRow;
