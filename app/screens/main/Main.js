// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { logout } from '/redux/auth/actions';
import { getMiningStatus, getGenesisTime, getAccountRewards } from '/redux/node/actions';
import { getTxList } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { Logo, QuitDialog } from '/components/common';
import { OfflineBanner } from '/components/banners';
import { SecondaryButton, NavTooltip } from '/basicComponents';
import routes from '/routes';
import { notificationsService } from '/infra/notificationsService';
import { rightDecoration, settingsIcon, getCoinsIcon, helpIcon, signOutIcon } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 5px 0 30px 30px;
`;

const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NavBarPart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const NavLinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-left: 140px;
`;

const NavBarLink = styled.div`
  margin-right: 15px;
  font-family: SourceCodeProBold;
  font-size: 12px;
  line-height: 15px;
  text-decoration-line: ${({ isActive }) => (isActive ? 'underline' : 'none')};
  text-transform: uppercase;
  color: ${({ isActive }) => (isActive ? smColors.purple : smColors.navLinkGrey)};
  cursor: pointer;
`;

const RightDecoration = styled.img`
  display: block;
  height: 100%;
`;

const RoutesWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const CustomTooltip = styled(NavTooltip)`
  bottom: -45px;
  right: -27px;
  width: 110px;
`;

const TooltipWrapper = styled.div`
  position: relative;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

const bntStyle = { marginRight: 15, marginTop: 10 };

type Props = {
  isConnected: boolean,
  miningStatus: number,
  genesisTime: number,
  getMiningStatus: Action,
  getGenesisTime: Action,
  getAccountRewards: Action,
  getTxList: Action,
  logout: Action,
  history: RouterHistory,
  location: { pathname: string, hash: string }
};

type State = {
  activeRouteIndex: number,
  isOfflineBannerVisible: boolean
};

class Main extends Component<Props, State> {
  miningStatusInterval: IntervalID;

  accountRewardsInterval: IntervalID;

  navMap: Array<() => void>;

  constructor(props: Props) {
    super(props);
    const { location, history } = props;
    const isWalletLocation = location.pathname.includes('/wallet');
    const activeRouteIndex = isWalletLocation ? 1 : 0;
    this.state = {
      activeRouteIndex,
      isOfflineBannerVisible: true
    };

    this.navMap = [
      () => history.push('/main/node'),
      () => history.push('/main/wallet'),
      () => history.push('/main/contacts'),
      () => history.push('/main/settings'),
      () => shell.openExternal('https://testnet.spacemesh.io/#/tap'),
      () => shell.openExternal('https://testnet.spacemesh.io/#/help')
    ];
  }

  render() {
    const { isConnected } = this.props;
    const { activeRouteIndex, isOfflineBannerVisible } = this.state;
    return (
      <Wrapper>
        <Logo />
        <InnerWrapper>
          <NavBar>
          <NavBarPart>
            <NavLinksWrapper>
              <TooltipWrapper>
                <NavBarLink onClick={() => this.handleNavigation({ index: 0 })} isActive={activeRouteIndex === 0}>
                  SMESHING
                </NavBarLink>
                <CustomTooltip text="SETUP OR MANAGE YOUR SMESHING" withIcon={false} isLinkTooltip />
              </TooltipWrapper>
              <TooltipWrapper>
                <NavBarLink onClick={() => this.handleNavigation({ index: 1 })} isActive={activeRouteIndex === 1}>
                  WALLET
                </NavBarLink>
                <CustomTooltip text="SEND / RECEIVE SMH" withIcon={false} isLinkTooltip />
              </TooltipWrapper>
              <TooltipWrapper>
                <NavBarLink onClick={() => this.handleNavigation({ index: 2 })} isActive={activeRouteIndex === 2}>
                  CONTACTS
                </NavBarLink>
                <CustomTooltip text="MANAGE YOUR CONTACTS" withIcon={false} isLinkTooltip />
              </TooltipWrapper>
            </NavLinksWrapper>
          </NavBarPart>
          <NavBarPart>
            <TooltipWrapper>
              <SecondaryButton
                onClick={() => this.handleNavigation({ index: 3 })}
                img={settingsIcon}
                imgHeight={30}
                imgWidth={30}
                isPrimary={activeRouteIndex === 3}
                width={35}
                height={35}
                style={bntStyle}
              />
              <CustomTooltip text="SETTINGS" withIcon={false} />
            </TooltipWrapper>
            <TooltipWrapper>
              <SecondaryButton
                onClick={() => this.handleNavigation({ index: 4 })}
                img={getCoinsIcon}
                imgHeight={30}
                imgWidth={30}
                isPrimary={false}
                width={35}
                height={35}
                style={bntStyle}
              />
              <CustomTooltip text="GET SMESH" withIcon={false} />
            </TooltipWrapper>
            <TooltipWrapper>
              <SecondaryButton
                onClick={() => this.handleNavigation({ index: 5 })}
                img={helpIcon}
                imgHeight={30}
                imgWidth={30}
                isPrimary={false}
                width={35}
                height={35}
                style={bntStyle}
              />
              <CustomTooltip text="HELP" withIcon={false} />
            </TooltipWrapper>
            <TooltipWrapper>
              <SecondaryButton
                onClick={() => this.handleNavigation({ index: 6 })}
                img={signOutIcon}
                imgHeight={30}
                imgWidth={30}
                isPrimary={false}
                width={35}
                height={35}
                style={bntStyle}
              />
              <CustomTooltip text="LOGOUT" withIcon={false} />
            </TooltipWrapper>
          </NavBarPart>
          </NavBar>
          <RoutesWrapper>
            {!isConnected && isOfflineBannerVisible && <OfflineBanner closeBanner={() => this.setState({ isOfflineBannerVisible: false })} />}
            <Switch>
              {routes.main.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
            </Switch>
          </RoutesWrapper>
        </InnerWrapper>
        <RightDecoration src={rightDecoration} />
        <QuitDialog />
      </Wrapper>
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { isConnected, miningStatus, genesisTime, getMiningStatus, getGenesisTime, getAccountRewards } = this.props;
    if (isConnected && [nodeConsts.IN_SETUP, nodeConsts.IS_MINING].includes(miningStatus) && genesisTime === 0) {
      getGenesisTime();
    }
    if (isConnected && prevProps.miningStatus === nodeConsts.NOT_MINING && miningStatus === nodeConsts.IN_SETUP) {
      this.miningStatusInterval = setInterval(() => { isConnected && getMiningStatus(); }, 300000);
    }
    if (isConnected && [nodeConsts.NOT_MINING, nodeConsts.IN_SETUP].includes(prevProps.miningStatus) && miningStatus === nodeConsts.IS_MINING) {
      clearInterval(this.miningStatusInterval);
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Your Smesher setup is complete! You are now participating in the Spacemesh network…!',
        callback: () => this.handleNavigation({ index: 0 })
      });
      this.accountRewardsInterval = setInterval(getAccountRewards, 10000);
    }
  }

  componentWillUnmount(): * {
    this.miningStatusInterval && clearImmediate(this.miningStatusInterval);
    this.accountRewardsInterval && clearImmediate(this.accountRewardsInterval);
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    const pathname = props.location.pathname;
    if (pathname.indexOf('backup') !== -1 || pathname.indexOf('transactions') !== -1) {
      return { activeRouteIndex: -1 };
    } else if (pathname.indexOf('contacts') !== -1 && prevState.activeRouteIndex === -1) {
      return { activeRouteIndex: 2 };
    }
    return null;
  }

  handleNavigation = ({ index }: { index: number }) => {
    const { history } = this.props;
    const { activeRouteIndex } = this.state;
    if (index !== activeRouteIndex) {
      switch (index) {
        case 0:
        case 1:
        case 2:
        case 3: {
          this.setState({ activeRouteIndex: index });
          this.navMap[index]();
          break;
        }
        case 4:
        case 5: {
          this.navMap[index]();
          break;
        }
        case 6: {
          history.push('/auth/unlock', { isLoggedOut: true });
          logout();
          break;
        }
        default:
          break;
      }
    }
  };
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  miningStatus: state.node.miningStatus,
  genesisTime: state.node.genesisTime
});

const mapDispatchToProps = {
  getMiningStatus,
  getGenesisTime,
  getAccountRewards,
  getTxList,
  logout
};

Main = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(Main);

Main = ScreenErrorBoundary(Main);
export default Main;
