// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { logout } from '/redux/auth/actions';
import { getNodeStatus, getMiningStatus, getAccountRewards } from '/redux/node/actions';
import { getTxList, updateWalletFile } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { Logo } from '/components/common';
import { InfoBanner } from '/components/banners';
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
  align-items: center;
  flex: 1;
  padding: 0 0 30px 30px;
`;

const NavBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: 9px;
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
  justify-content: center;
  height: calc(100% - 200px);
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
  status: Object,
  miningStatus: number,
  getNodeStatus: Action,
  getMiningStatus: Action,
  getAccountRewards: Action,
  getTxList: Action,
  updateWalletFile: Action,
  logout: Action,
  history: RouterHistory,
  location: { pathname: string, hash: string }
};

type State = {
  activeRouteIndex: number,
  isOfflineBannerVisible: boolean
};

class Main extends Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  getNodeStatusInterval: IntervalID;

  initialMiningStatusInterval: IntervalID;

  miningStatusInterval: IntervalID;

  accountRewardsInterval: IntervalID;

  txCollectorInterval: IntervalID;

  walletFileUpdateInterval: IntervalID;

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
      () => shell.openExternal('https://testnet.spacemesh.io/#/get_coin'),
      () => shell.openExternal('https://testnet.spacemesh.io/#/help')
    ];
  }

  render() {
    const { activeRouteIndex } = this.state;
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
                  <CustomTooltip text="MANAGE SMESHING" withIcon={false} isLinkTooltip />
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
                  <CustomTooltip text="MANAGE CONTACTS" withIcon={false} isLinkTooltip />
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
          <InfoBanner />
          <RoutesWrapper>
            <Switch>
              {routes.main.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
            </Switch>
          </RoutesWrapper>
        </InnerWrapper>
        <RightDecoration src={rightDecoration} />
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { getNodeStatus, getMiningStatus, getTxList, updateWalletFile, getAccountRewards, miningStatus, history } = this.props;
    getNodeStatus();
    await getAccountRewards({ notify: () => {} });
    this.getNodeStatusInterval = setInterval(getNodeStatus, 20000);
    this.initialMiningStatusInterval = setInterval(async () => {
      const status = await getMiningStatus();
      if (status !== nodeConsts.MINING_UNSET) {
        clearInterval(this.initialMiningStatusInterval);
      }
    }, 1000);
    this.txCollectorInterval = setInterval(() => getTxList({ notify: ({ hasConfirmedIncomingTxs }) => {
        notificationsService.notify({
          title: 'Spacemesh',
          notification: `${hasConfirmedIncomingTxs ? 'Incoming' : 'Sent'} transaction approved`,
          callback: () => history.push('/main/transactions')
        });
      } }), 30000);
    if (miningStatus === nodeConsts.IN_SETUP) {
      this.miningStatusInterval = setInterval(() => {
        getMiningStatus();
      }, 100000);
    }
    this.walletFileUpdateInterval = setInterval(() => updateWalletFile({}), 500);
  }

  componentDidUpdate(prevProps: Props) {
    const {miningStatus, getMiningStatus, getAccountRewards } = this.props;
    if (prevProps.miningStatus === nodeConsts.NOT_MINING && miningStatus === nodeConsts.IN_SETUP) {
      this.miningStatusInterval = setInterval(getMiningStatus, 100000);
    }
    if ([nodeConsts.NOT_MINING, nodeConsts.IN_SETUP].includes(prevProps.miningStatus) && miningStatus === nodeConsts.IS_MINING) {
      clearInterval(this.miningStatusInterval);
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Your Smesher setup is complete! You are now participating in the Spacemesh network!',
        callback: () => this.handleNavigation({ index: 0 })
      });
    }
    if (miningStatus === nodeConsts.IS_MINING) {
      this.accountRewardsInterval = setInterval(() => getAccountRewards({ notify: () => {
          notificationsService.notify({
            title: 'Spacemesh',
            notification: 'Received a reward for smeshing!',
            callback: () => this.handleNavigation({ index: 0 })
          });
        } }), 180000);
    }
  }

  componentWillUnmount() {
    this.initialMiningStatusInterval && clearInterval(this.initialMiningStatusInterval);
    this.miningStatusInterval && clearInterval(this.miningStatusInterval);
    this.accountRewardsInterval && clearInterval(this.accountRewardsInterval);
    this.txCollectorInterval && clearInterval(this.txCollectorInterval);
    this.walletFileUpdateInterval && clearInterval(this.walletFileUpdateInterval);
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    const pathname = props.location.pathname;
    if (pathname.indexOf('backup') !== -1 || pathname.indexOf('transactions') !== -1) {
      return { activeRouteIndex: -1 };
    } else if (pathname.indexOf('contacts') !== -1) {
      return { activeRouteIndex: 2 };
    } else if (pathname.indexOf('send-coins') !== -1 && prevState.activeRouteIndex === 2) {
      return { activeRouteIndex: 1 };
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
  status: state.node.status,
  miningStatus: state.node.miningStatus
});

const mapDispatchToProps = {
  getNodeStatus,
  getMiningStatus,
  getAccountRewards,
  getTxList,
  updateWalletFile,
  logout
};

Main = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(Main);

Main = ScreenErrorBoundary(Main);
export default Main;
