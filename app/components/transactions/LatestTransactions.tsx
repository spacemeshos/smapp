import React from 'react';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import { BoldText, Button } from '../../basicComponents';
import {
  getAbbreviatedText,
  getFormattedTimestamp,
  getAddress,
  formatSmidge,
} from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { TxState } from '../../../shared/types';
import {
  getLatestTransactions,
  RewardView,
  TxView,
} from '../../redux/wallet/selectors';
import { isReward } from '../../../shared/types/guards';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100%;
  padding: 20px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const Header = styled(BoldText)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  margin-bottom: 10px;
`;

const TxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Icon = styled.img`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray};
`;

const NickName = styled(Text)`
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const Amount = styled.div`
  color: ${({ color }) => color};
`;

type Props = {
  navigateToAllTransactions: () => void;
};

const LatestTransactions = ({ navigateToAllTransactions }: Props) => {
  const {
    icons: { chevronPrimaryLeft, chevronPrimaryRight },
  } = useTheme();

  const publicKey = useSelector(
    (state: RootState) =>
      state.wallet.accounts[state.wallet.currentAccountIndex]?.publicKey
  );
  const latestTransactions = useSelector(getLatestTransactions(publicKey));

  const getColor = ({
    status,
    isSent,
  }: {
    status: number;
    isSent: boolean;
  }) => {
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
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };

  const renderTransaction = (tx: TxView) => {
    const { id, status, amount, sender, timestamp, senderNickname } = tx;
    const isSent = sender === getAddress(publicKey);
    const color = getColor({ status, isSent });

    const chevron = isSent ? chevronPrimaryRight : chevronPrimaryLeft;

    return (
      <TxWrapper key={`tx_${id}`}>
        <Icon src={chevron} />
        <MainWrapper>
          <Section>
            <NickName>{senderNickname || getAbbreviatedText(sender)}</NickName>
            {id === 'reward' ? null : <Text>{getAbbreviatedText(id)}</Text>}
          </Section>
          <Section>
            <Text>{getFormattedTimestamp(timestamp)}</Text>
            <Amount color={color}>{`${isSent ? '-' : '+'}${formatSmidge(
              amount
            )}`}</Amount>
          </Section>
        </MainWrapper>
      </TxWrapper>
    );
  };

  const renderReward = (tx: RewardView) => {
    const { amount, timestamp, layer } = tx;
    return (
      <TxWrapper key={`${publicKey}_reward_${layer}`}>
        <Icon src={chevronPrimaryLeft} />
        <MainWrapper>
          <Section>
            <NickName>Smeshing reward</NickName>
          </Section>
          <Section>
            <Text>{getFormattedTimestamp(timestamp)}</Text>
            <Amount color={smColors.darkerGreen}>{`+${formatSmidge(
              amount
            )}`}</Amount>
          </Section>
        </MainWrapper>
      </TxWrapper>
    );
  };

  const renderedLatestTransactions = latestTransactions.map((tx) =>
    isReward(tx) ? renderReward(tx) : renderTransaction(tx)
  );

  return (
    <Wrapper>
      <Header>
        Transactions
        <br />
        --
      </Header>
      <div>{renderedLatestTransactions}</div>
      <Button
        onClick={navigateToAllTransactions}
        text="ALL TRANSACTIONS"
        width={175}
        style={{ marginTop: 'auto ' }}
      />
    </Wrapper>
  );
};

export default LatestTransactions;
