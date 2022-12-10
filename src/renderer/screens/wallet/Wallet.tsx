import React from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import routes from '../../routes';
import { MainPath } from '../../routerPaths';
import { AccountsOverview } from '../../components/wallet';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { BackButton } from '../../components/common';
import { setCurrentMode } from '../../redux/wallet/actions';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 500px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-top: 2px;
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
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dMBlack1 : smColors.black02Alpha};
  cursor: pointer;
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const BackupImage = styled.img.attrs((props) => ({
  src: props.theme.icons.backup,
}))`
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

const FullCrossIcon = styled.img.attrs(
  ({
    theme: {
      icons: { leftSideTIcon },
    },
  }) => ({ src: leftSideTIcon })
)`
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

const Wallet = ({ history, location }: RouteComponentProps) => {
  const backupTime = useSelector((state: RootState) => state.wallet.backupTime);
  const vaultMode = useSelector((state: RootState) => state.wallet.vaultMode);
  const dispatch = useDispatch();

  const navigateToBackup = () => {
    history.push(MainPath.BackupWallet);
  };

  const handleModeBack = () => {
    if (vaultMode === 0) history.goBack();
    else dispatch(setCurrentMode(vaultMode - 1));
  };

  const hasBackButton = location.pathname.includes('vault');
  return (
    <Wrapper>
      <LeftSection>
        {hasBackButton && <BackButton action={handleModeBack} />}
        <AccountsOverview />
        {!backupTime && (
          <BackupReminder onClick={navigateToBackup}>
            <FullCrossIcon />
            <BackupImage />
            <BackupText>BACKUP YOUR WALLET</BackupText>
          </BackupReminder>
        )}
      </LeftSection>
      <Wrapper>
        <RightSection>
          <Switch>
            {routes.wallet.map((route) => (
              <Route
                exact
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
            <Redirect to="/main/wallet/overview" />
          </Switch>
        </RightSection>
      </Wrapper>
    </Wrapper>
  );
};

export default Wallet;
