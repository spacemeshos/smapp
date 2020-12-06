import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { LatestTransactions } from '../../components/transactions';
import { Button, Link } from '../../basicComponents';
import { sendIcon, requestIcon } from '../../assets/images';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';

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
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha)};
`;

const MiddleSectionHeader = styled.div`
  margin-bottom: 10px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const MiddleSectionText = styled.div`
  flex: 1;
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const Overview = ({ history }: RouteComponentProps) => {
  const account = useSelector((state: RootState) => state.wallet.accounts[state.wallet.currentAccountIndex]);
  const isSmeshing = useSelector((state: RootState) => state.smesher.isSmeshing);
  const isCreatingPosData = useSelector((state: RootState) => state.smesher.isCreatingPosData);

  const navigateToSendCoins = () => {
    history.push('/main/wallet/send-coins');
  };

  const navigateToRequestCoins = () => {
    history.push('/main/wallet/request-coins', { account, isSmesherActive: isCreatingPosData || isSmeshing });
  };

  const navigateToAllTransactions = () => {
    history.push('/main/transactions');
  };

  const navigateToWalletGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/wallet' });

  return (
    <Wrapper>
      <MiddleSection>
        <MiddleSectionHeader>
          Send or Request
          <br />
          --
        </MiddleSectionHeader>
        <MiddleSectionText>Send SMH to anyone, or request to receive SMH.</MiddleSectionText>
        <Button onClick={navigateToSendCoins} text="SEND" isPrimary={false} width={225} img={sendIcon} imgPosition="after" style={{ marginBottom: 20 }} />
        <Button onClick={navigateToRequestCoins} text="REQUEST" isPrimary={false} img={requestIcon} imgPosition="after" width={225} style={{ marginBottom: 35 }} />
        <Link onClick={navigateToWalletGuide} text="WALLET GUIDE" style={{ marginRight: 'auto' }} />
      </MiddleSection>
      <LatestTransactions navigateToAllTransactions={navigateToAllTransactions} />
    </Wrapper>
  );
};

export default Overview;
