import React from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import routes from '../../routes';
import { AccountsOverview } from '../../components/wallet';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { CorneredWrapper, SmallHorizontalPanel } from '../../basicComponents';
import { smColors } from '../../vars';
import { backup, leftSideTIcon, leftSideTIconWhite } from '../../assets/images';
import { RootState } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const BackupReminder = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  width: 230px;
  height: 50px;
  margin-top: 10px;
  padding: 0 15px;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dMBlack1 : smColors.black02Alpha)};
  cursor: pointer;
`;

const BackupImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 15px;
  cursor: inherit;
`;

const BackupText = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${smColors.darkOrange};
  cursor: inherit;
`;

const FullCrossIcon = styled.img`
  position: absolute;
  top: -11px;
  right: -13px;
  width: 12px;
  height: 12px;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const Wallet = ({ history }: RouteComponentProps) => {
  const backupTime = useSelector((state: RootState) => state.wallet.backupTime);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const icon = isDarkMode ? leftSideTIconWhite : leftSideTIcon;

  const navigateToBackup = () => {
    history.push('/main/backup');
  };

  const navigateToVault = () => {
    history.push('/main/wallet/vault');
  };

  return (
    <Wrapper>
      <LeftSection>
        <AccountsOverview navigateToVault={navigateToVault} />
        {!backupTime && (
          <BackupReminder onClick={navigateToBackup}>
            <FullCrossIcon src={icon} />
            <BackupImage src={backup} />
            <BackupText>BACKUP YOUR WALLET</BackupText>
          </BackupReminder>
        )}
      </LeftSection>
      <CorneredWrapper isDarkMode={isDarkMode}>
        <RightSection>
          <SmallHorizontalPanel isDarkMode={isDarkMode} />
          <Switch>
            {routes.wallet.map((route) => (
              <Route exact key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/main/wallet/overview" />
          </Switch>
        </RightSection>
      </CorneredWrapper>
    </Wrapper>
  );
};

export default ScreenErrorBoundary(Wallet);
