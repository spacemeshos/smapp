import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { LatestTransactions } from '../../components/transactions';
import { BoldText, Button, Link } from '../../basicComponents';
import { sendIcon, requestIcon } from '../../assets/images';
import { RootState } from '../../types';
import { MainPath, WalletPath } from '../../routerPaths';
import { PostSetupState, TxState } from '../../../shared/types';
import { ExternalLinks } from '../../../shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  height: 100%;
  margin-right: 10px;
  padding: 25px 15px;
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const MiddleSectionHeader = styled(BoldText)`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const MiddleSectionText = styled.div`
  flex: 1;
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const Overview = ({ history }: RouteComponentProps) => {
  const accountIndex = useSelector(
    (state: RootState) => state.wallet.currentAccountIndex || 0
  );
  const currentLayer = useSelector(
    (state: RootState) => state.node.status?.topLayer || 0
  );

  const account = useSelector(
    (state: RootState) => state.wallet.accounts[accountIndex]
  );
  const txs = useSelector(
    (state: RootState) =>
      (account?.address &&
        Object.values(state?.wallet?.transactions?.[account.address] || {})) ||
      []
  );
  const isNodeSynced = useSelector(
    (state: RootState) => state.node.status?.isSynced || false
  );

  const isSmeshing = useSelector(
    (state: RootState) =>
      state.smesher.postSetupState === PostSetupState.STATE_COMPLETE
  );
  const isCreatingPosData = useSelector(
    (state: RootState) =>
      state.smesher.postSetupState === PostSetupState.STATE_IN_PROGRESS
  );

  const navigateToSpawnAccount = async () => {
    history.push(WalletPath.SpawnAccount);
  };

  const navigateToSendCoins = () => {
    history.push(WalletPath.SendCoins);
  };

  const navigateToRequestCoins = () => {
    history.push(WalletPath.RequestCoins, {
      account,
      isSmesherActive: isCreatingPosData || isSmeshing,
    });
  };

  const navigateToAllTransactions = () => {
    history.push(MainPath.Transactions);
  };

  const navigateToWalletGuide = () => window.open(ExternalLinks.WalletGuide);

  const pendingSpawnTx = txs.find(
    (tx) =>
      tx.meta?.templateName === 'SingleSig' &&
      tx.method === 0 &&
      (tx.status === TxState.MEMPOOL ||
        tx.status === TxState.MESH ||
        tx.status === TxState.PROCESSED) &&
      tx.layer &&
      currentLayer > 0 &&
      currentLayer - 5 < tx.layer
  );
  const isAccountPendingSpawnTx = !!pendingSpawnTx;
  const isAccountSpawned = !!txs.find(
    (tx) =>
      tx.meta?.templateName === 'SingleSig' &&
      tx.method === 0 &&
      tx.status === TxState.SUCCESS
  );

  const renderMiddleSection = () =>
    isAccountSpawned ? (
      <MiddleSectionText>
        Send SMH to anyone, or request to receive SMH.
      </MiddleSectionText>
    ) : (
      <MiddleSectionText>
        <strong>The account is not spawned yet.</strong>
        <br />
        It means you can receive SMH on this address, but to send SMH to someone
        else you will need to spawn account first.
      </MiddleSectionText>
    );

  const renderActionButton = () =>
    !isAccountSpawned ? (
      <Button
        onClick={navigateToSpawnAccount}
        text="SPAWN"
        isPrimary
        width={225}
        img={sendIcon}
        imgPosition="after"
        style={{ marginBottom: 20 }}
        isDisabled={isAccountPendingSpawnTx}
      />
    ) : (
      <Button
        onClick={navigateToSendCoins}
        text="SEND"
        isPrimary={false}
        width={225}
        img={sendIcon}
        imgPosition="after"
        style={{ marginBottom: 20 }}
      />
    );

  return (
    <Wrapper>
      <MiddleSection>
        <MiddleSectionHeader>
          Send or Request
          <br />
          --
        </MiddleSectionHeader>
        {renderMiddleSection()}
        {isNodeSynced ? (
          renderActionButton()
        ) : (
          <Button
            onClick={() => {}}
            text="WAITING FOR NODE TO SYNC"
            width={225}
            isDisabled
          />
        )}
        <Button
          onClick={navigateToRequestCoins}
          text="REQUEST"
          isPrimary={false}
          img={requestIcon}
          imgPosition="after"
          width={225}
          style={{ marginBottom: 35 }}
        />
        <Link
          onClick={navigateToWalletGuide}
          text="WALLET GUIDE"
          style={{ marginRight: 'auto' }}
        />
      </MiddleSection>
      <LatestTransactions
        navigateToAllTransactions={navigateToAllTransactions}
      />
    </Wrapper>
  );
};

export default Overview;
