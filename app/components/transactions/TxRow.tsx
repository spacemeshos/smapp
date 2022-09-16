import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Modal } from '../common';
import { Button, Link, Input } from '../../basicComponents';
import {
  getFormattedTimestamp,
  formatSmidge,
} from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { TxState } from '../../../shared/types';
import { TxView } from '../../redux/wallet/selectors';
import Address, { AddressType } from '../common/Address';
import { ExternalLinks, TX_STATE_LABELS } from '../../../shared/constants';

const Wrapper = styled.div<{ isDetailed: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isDetailed }) =>
    isDetailed && `background-color: ${smColors.lighterGray};`}
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 15px 10px;
  cursor: pointer;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.black : 'transparent'};
  &:hover {
    background-color: ${({ theme }) =>
      theme.isDarkMode ? smColors.dark75Alpha : smColors.disabledGray};
  }
`;

const Icon = styled.img.attrs<{ chevronRight: boolean }>(
  ({
    theme: {
      icons: { chevronPrimaryLeft, chevronPrimaryRight },
    },
    chevronRight,
  }) => ({
    src: chevronRight ? chevronPrimaryRight : chevronPrimaryLeft,
  })
)<{ chevronRight: boolean }>`
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray50Alpha};
`;

const BlackText = styled(Text)`
  color: ${({ theme }) => theme.color.contrast};
`;

const BoldText = styled(Text)`
  font-weight: 800;
  color: ${({ color, theme }) => {
    if (color) {
      return color;
    } else {
      return theme.color.contrast;
    }
  }};
`;

const DarkGrayText = styled(Text)`
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray};
  cursor: inherit;
  text-align: right;
`;

const Amount = styled.div`
  font-size: 13px;
  margin: 2px 0px;
  text-align: right;
  color: ${({ color }) => color};
  cursor: inherit;
`;

const DetailsSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 12px 12px 20px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.black : 'transparent'};
`;

const TextRow = styled.div<{ isLast?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  padding: 5px 0;
  border-bottom: ${({ isLast, theme }) =>
    isLast
      ? `0px`
      : `1px solid ${
          theme.isDarkMode ? smColors.dMBlack1 : smColors.darkGray10Alpha
        };`};
  :first-child {
    border-top: ${({ theme }) =>
      `1px solid ${
        theme.isDarkMode ? smColors.dMBlack1 : smColors.darkGray10Alpha
      };`};
  }
  :last-child {
    border-bottom: none;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Chevron = styled.img.attrs(
  ({
    theme: {
      icons: { chevronPrimaryRight },
    },
  }) => ({ src: chevronPrimaryRight })
)`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const LinkEdit = styled.span`
  color: ${smColors.blue};
  text-decoration: underline;
  margin-left: 5px;
  cursor: pointer;
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

const formatTxId = (id: string | undefined) => id && `0x${id.substring(0, 6)}`;

type Props = {
  tx: TxView;
  address: string;
  addAddressToContacts: ({ address }: { address: string }) => void;
};

const TxRow = ({ tx, address, addAddressToContacts }: Props) => {
  const [isDetailed, setIsDetailed] = useState(false);
  const [note, setNote] = useState(tx.note || '');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const currentAccountIndex = useSelector(
    (state: RootState) => state.wallet.currentAccountIndex
  );

  const getColor = (isSent: boolean) => {
    const { status } = tx;
    if (
      status === TxState.TRANSACTION_STATE_MEMPOOL ||
      status === TxState.TRANSACTION_STATE_MESH
    ) {
      return smColors.orange;
    } else if (
      status === TxState.TRANSACTION_STATE_REJECTED ||
      status === TxState.TRANSACTION_STATE_INSUFFICIENT_FUNDS ||
      status === TxState.TRANSACTION_STATE_CONFLICTING
    ) {
      return smColors.red;
    } else if (status === TxState.TRANSACTION_STATE_UNSPECIFIED) {
      return smColors.mediumGray;
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };

  const isSent = tx.principal === address;
  const color = getColor(isSent);

  const save = async () => {
    await eventsService.updateTransactionNote(currentAccountIndex, tx.id, note);
    setIsDetailed(false);
    setShowNoteModal(false);
  };

  const toggleTxDetails = () => {
    setIsDetailed(!isDetailed);
  };

  const txFrom = isSent ? address : tx.principal;
  const txFromSuffix = (isSent && '(Me)') || undefined;
  const txFromAddContact =
    tx.senderNickname || isSent
      ? undefined
      : () => addAddressToContacts({ address: tx.principal });

  const txTo = isSent ? tx.receiverNickname || tx.receiver : address;
  const txToSuffix = (!isSent && '(Me)') || undefined;
  const txToAddContract =
    tx.receiverNickname || !isSent
      ? undefined
      : () => addAddressToContacts({ address: tx.receiver });

  const renderDetails = () => (
    <DetailsSection>
      <TextRow>
        <BlackText>TRANSACTION ID</BlackText>
        <BoldText>
          <Address type={AddressType.TX} address={`0x${tx.id}`} />
        </BoldText>
      </TextRow>
      <TextRow>
        <BlackText>STATUS</BlackText>
        <BoldText color={color}>{TX_STATE_LABELS[tx.status]}</BoldText>
      </TextRow>
      {tx.layer ? (
        <TextRow>
          <BlackText>LAYER ID</BlackText>
          <BoldText>{tx.layer}</BoldText>
        </TextRow>
      ) : null}
      <TextRow>
        <BlackText>FROM</BlackText>
        <BoldText>
          <Address
            address={txFrom}
            suffix={txFromSuffix}
            overlapText={tx.senderNickname}
            addToContacts={txFromAddContact}
          />
        </BoldText>
      </TextRow>
      <TextRow>
        <BlackText>TO</BlackText>
        <BoldText>
          <Address
            address={txTo}
            suffix={txToSuffix}
            overlapText={tx.receiverNickname}
            addToContacts={txToAddContract}
          />
        </BoldText>
      </TextRow>
      <TextRow>
        <BlackText>AMOUNT</BlackText>
        <BoldText>{formatSmidge(tx.amount)}</BoldText>
      </TextRow>
      <TextRow>
        <BlackText>FEE</BlackText>
        <BoldText>
          {formatSmidge(tx.gasOffered?.provided || tx.receipt?.fee || 0)}
        </BoldText>
      </TextRow>
      <TextRow>
        <BlackText>NOTE</BlackText>
        <BlackText>
          {note ? `${note}` : `NO NOTE`}
          <LinkEdit onClick={() => setShowNoteModal(true)}>EDIT</LinkEdit>
        </BlackText>
      </TextRow>
    </DetailsSection>
  );

  const renderNickname = () => {
    const nickname =
      (isSent && tx.receiverNickname) || (!isSent && tx.senderNickname);
    return (
      nickname && (
        <DarkGrayText key="nickname">
          {nickname && nickname.toUpperCase()}
        </DarkGrayText>
      )
    );
  };

  return (
    <Wrapper isDetailed={isDetailed}>
      <Header onClick={toggleTxDetails}>
        <Icon chevronRight={isSent} />
        <HeaderInner>
          <HeaderSection>
            {renderNickname()}
            <Text key={tx.id}>{formatTxId(tx.id)}</Text>
          </HeaderSection>
          <HeaderSection>
            <Amount color={color}>{`${isSent ? '-' : '+'}${formatSmidge(
              tx.amount
            )}`}</Amount>
            <DarkGrayText>{getFormattedTimestamp(tx.timestamp)}</DarkGrayText>
          </HeaderSection>
        </HeaderInner>
      </Header>
      {isDetailed && renderDetails()}
      {showNoteModal && (
        <Modal header="Note" subHeader="enter your transaction note">
          <InputSection>
            <Chevron />
            <Input
              type="text"
              placeholder="NOTE"
              value={note}
              onEnterPress={save}
              onChange={({ value }: { value: string }) => {
                setNote(value);
              }}
              autofocus
            />
          </InputSection>
          <ButtonsWrapper>
            <Link
              onClick={() => window.open(ExternalLinks.SendCoinGuide)}
              text="TRANSACTION GUIDE"
            />
            <RightButton>
              <Link
                style={{ color: smColors.orange, marginRight: '10px' }}
                onClick={() => setShowNoteModal(false)}
                text="CANCEL"
              />
              <Button
                text="NEXT"
                isDisabled={note === tx.note}
                onClick={save}
              />
            </RightButton>
          </ButtonsWrapper>
        </Modal>
      )}
    </Wrapper>
  );
};

export default TxRow;
