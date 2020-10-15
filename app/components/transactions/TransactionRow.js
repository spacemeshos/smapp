// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateTransaction } from '/redux/wallet/actions';
import { chevronLeftBlack, chevronLeftWhite, chevronRightBlack, chevronRightWhite, addContact } from '/assets/images';
import styled from 'styled-components';
import { Modal } from '/components/common';
import { Button, Link, Input } from '/basicComponents';
import { getAbbreviatedText, getFormattedTimestamp, getAddress, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';
import TX_STATUSES from '/vars/enums';
import type { Tx, Action } from '/types';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const chevronLeft = isDarkModeOn ? chevronLeftWhite : chevronLeftBlack;
const chevronRight = isDarkModeOn ? chevronRightWhite : chevronRightBlack;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) => isDetailed && `background-color: ${smColors.lighterGray};`}
  border-bottom: 1px solid ${smColors.disabledGray};
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 0 15px;
  cursor: pointer;
  background-color: ${isDarkModeOn ? smColors.black : 'transparent'};
  &:hover {
    background-color: ${isDarkModeOn ? smColors.dark75Alpha : smColors.disabledGray};
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
  color: ${isDarkModeOn ? smColors.white : smColors.darkGray50Alpha};
`;

const BlackText = styled(Text)`
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  color: ${({ color }) => (color || isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const DarkGrayText = styled(Text)`
  color: ${isDarkModeOn ? smColors.white : smColors.darkGray};
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
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 12px 12px 20px;
  background-color: ${isDarkModeOn ? smColors.black : 'transparent'};
`;

const TextRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 0;
  border-bottom: ${({ isLast }) => (isLast ? `0px` : `1px solid ${isDarkModeOn ? smColors.white : smColors.darkGray10Alpha};`)};
`;

const AddToContactsImg = styled.img`
  width: 14px;
  height: 12px;
  cursor: pointer;
  margin-left: 4px;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Chevron = styled.img`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const LinkEdit = styled.span`
  color: ${smColors.blue};
  text-decoration: underline;
  margin-left: 5px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin: 30px 0 15px 0;
`;

const RightButton = styled.div`
  display: flex;
  align-items: flex-end;
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
      wasCopied: false,
      showNoteModal: false
    };
    this.statuses = Object.keys(TX_STATUSES);
  }

  render() {
    const {
      tx,
      tx: { txId, sender, status, amount, timestamp, nickname },
      publicKey
    } = this.props;
    const { isDetailed, wasCopied, showNoteModal, note } = this.state;
    const isSent = sender === getAddress(publicKey);
    const color = this.getColor({ status, isSent });
    return (
      <Wrapper isDetailed={isDetailed}>
        <Header onClick={this.toggleTxDetails}>
          <Icon src={isSent ? chevronRight : chevronLeft} />
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
        {showNoteModal && (
          <Modal header="Note" subHeader="enter your transaction note">
            <InputSection>
              <Chevron src={chevronRight} />
              <Input
                type="text"
                placeholder="NOTE"
                value={note}
                onEnterPress={this.save}
                onChange={({ value }: { value: string }) => {
                  this.setState({ note: value });
                }}
              />
            </InputSection>
            <ButtonsWrapper>
              <Link onClick={() => shell.openExternal('https://testnet.spacemesh.io/#/send_coin')} text="TRANSACTION GUIDE" />
              <RightButton>
                <Link style={{ color: smColors.orange, marginRight: '10px' }} onClick={() => this.setState({ showNoteModal: false })} text="CANCEL" />
                <Button text="NEXT" isDisabled={note === tx.note} onClick={this.save} />
              </RightButton>
            </ButtonsWrapper>
          </Modal>
        )}
      </Wrapper>
    );
  }

  renderDetails = () => {
    const {
      tx: { txId, nickname, status, layerId, sender, receiver, amount, fee },
      publicKey
    } = this.props;
    const { note } = this.state;
    const isSent = sender === getAddress(publicKey);
    const color = this.getColor({ status, isSent });
    if (txId === 'reward') {
      return (
        <DetailsSection>
          <TextRow>
            <BlackText>STATUS</BlackText>
            <BoldText color={smColors.darkerGreen}>{this.statuses[status]}</BoldText>
          </TextRow>
          {layerId ? (
            <TextRow>
              <BlackText>LAYER ID</BlackText>
              <BoldText>{layerId}</BoldText>
            </TextRow>
          ) : null}
          <TextRow>
            <BlackText>TO</BlackText>
            <BoldText>ME</BoldText>
          </TextRow>
          <TextRow>
            <BlackText>SMESHING REWARD</BlackText>
            <BoldText>{formatSmidge(amount)}</BoldText>
          </TextRow>
          <TextRow>
            <BlackText>SMESHING FEE REWARD</BlackText>
            <BoldText>{formatSmidge(fee || 0)}</BoldText>
          </TextRow>
        </DetailsSection>
      );
    }
    return (
      <DetailsSection>
        <TextRow>
          <BlackText>TRANSACTION ID</BlackText>
          <BoldText onClick={() => this.copyAddress({ id: txId })}>{formatTxId(txId)}</BoldText>
        </TextRow>
        <TextRow>
          <BlackText>STATUS</BlackText>
          <BoldText color={color}>{this.statuses[status]}</BoldText>
        </TextRow>
        {layerId ? (
          <TextRow>
            <BlackText>LAYER ID</BlackText>
            <BoldText>{layerId}</BoldText>
          </TextRow>
        ) : null}
        <TextRow>
          <BlackText>FROM</BlackText>
          <BoldText onClick={!isSent ? () => this.copyAddress({ id: sender }) : null}>
            {isSent ? `${getAbbreviatedText(getAddress(publicKey))} (Me)` : nickname || getAbbreviatedText(sender)}
            {!isSent && !nickname && <AddToContactsImg onClick={(e) => this.handleAddToContacts(e, sender)} src={addContact} />}
          </BoldText>
        </TextRow>
        <TextRow>
          <BlackText>TO</BlackText>
          <BoldText onClick={isSent ? () => this.copyAddress({ id: receiver }) : null}>
            {isSent ? nickname || getAbbreviatedText(receiver) : `${getAbbreviatedText(getAddress(publicKey))} (Me)`}
            {isSent && !nickname && <AddToContactsImg onClick={(e) => this.handleAddToContacts(e, receiver)} src={addContact} />}
          </BoldText>
        </TextRow>
        <TextRow>
          <BlackText>VALUE</BlackText>
          <BoldText>{formatSmidge(amount)}</BoldText>
        </TextRow>
        <TextRow>
          <BlackText>TRANSACTION FEE</BlackText>
          <BoldText>{formatSmidge(fee || 0)}</BoldText>
        </TextRow>
        <TextRow>
          <BlackText>NOTE</BlackText>
          <BlackText>
            {note ? `${note}` : `NO NOTE`}
            <LinkEdit onClick={() => this.setState({ showNoteModal: true })}>EDIT</LinkEdit>
          </BlackText>
        </TextRow>
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
      this.setState({ isDetailed: false, showNoteModal: false });
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
