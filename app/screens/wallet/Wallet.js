// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import routes from '/routes';
import { AccountsOverview } from '/components/wallet';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { CorneredWrapper, SmallHorizontalPanel } from '/basicComponents';
import smColors from '/vars/colors';
import { backup, leftSideTIcon, leftSideTIconWhite } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';

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
  background-color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dMBlack1 : smColors.black02Alpha)};
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
  color: ${smColors.orange};
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

type Props = {
  isDarkModeOn: boolean,
  backupTime: string,
  history: RouterHistory,
  location: { pathname: string }
};

type State = {
  shouldShowReceiveCoinsModal: boolean,
  address?: string,
  shouldShowAddContactModal: boolean,
  isCopied: boolean
};

class Wallet extends Component<Props, State> {
  render() {
    const { backupTime, isDarkModeOn } = this.props;
    const icon = isDarkModeOn ? leftSideTIconWhite : leftSideTIcon;

    return (
      <Wrapper>
        <LeftSection>
          <AccountsOverview />
          {!backupTime && (
            <BackupReminder onClick={this.navigateToBackup}>
              <FullCrossIcon src={icon} />
              <BackupImage src={backup} />
              <BackupText>BACKUP YOUR WALLET</BackupText>
            </BackupReminder>
          )}
        </LeftSection>
        <CorneredWrapper isDarkModeOn={isDarkModeOn}>
          <RightSection>
            <SmallHorizontalPanel isDarkModeOn={isDarkModeOn} />
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
  }

  navigateToBackup = () => {
    const { history } = this.props;
    history.push('/main/backup');
  };
}

const mapStateToProps = (state) => ({
  backupTime: state.wallet.backupTime,
  isDarkModeOn: state.ui.isDarkMode
});

Wallet = connect<any, any, _, _, _, _>(mapStateToProps)(Wallet);

Wallet = ScreenErrorBoundary(Wallet);
export default Wallet;
