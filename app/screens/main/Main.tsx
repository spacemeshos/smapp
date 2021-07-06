import React, { Component } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { logout } from '../../redux/auth/actions';
import { getNetworkDefinitions } from '../../redux/network/actions';
import { getVersionAndBuild } from '../../redux/node/actions';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { Logo } from '../../components/common';
import { InfoBanner } from '../../components/banners';
import { SecondaryButton, NavTooltip, NetworkIndicator } from '../../basicComponents';
import routes from '../../routes';
import {
  rightDecoration,
  rightDecorationWhite,
  settingsIcon,
  settingsIconBlack,
  getCoinsIcon,
  getCoinsIconBlack,
  helpIcon,
  helpIconBlack,
  signOutIcon,
  signOutIconBlack
} from '../../assets/images';
import { smColors } from '../../vars';
import { AppThDispatch, RootState, Status } from '../../types';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 32px 32px 32px;
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

const NavBarLink = styled.div<{ isActive?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  margin-right: -1px;
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

const EmptySpace = styled.div`
  width: 100%;
  margin: 30px;
`;

interface Props extends RouteComponentProps {
  status: Status;
  logout: any;
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: unknown;
  };
  nodeError: any;
  isDarkMode: boolean;
  getNetworkDefinitions: AppThDispatch;
  getVersionAndBuild: AppThDispatch;
}

type State = {
  activeRouteIndex: number;
};

class Main extends Component<Props, State> {
  private readonly navMap: Array<() => void>; // eslint-disable-line react/sort-comp

  constructor(props: Props) {
    super(props);
    const { location, history } = props;
    const isWalletLocation = location.pathname.includes('/wallet');
    const activeRouteIndex = isWalletLocation ? 2 : 0;
    this.state = {
      activeRouteIndex
    };

    this.navMap = [
      () => history.push('/main/node'),
      () => history.push('/main/network'),
      () => history.push('/main/wallet'),
      () => history.push('/main/contacts'),
      () => history.push('/main/dash'),
      () => history.push('/main/settings'),
      () => window.open('https://testnet.spacemesh.io/#/get_coin'),
      () => window.open('https://testnet.spacemesh.io/#/help')
    ];
  }

  render() {
    const { activeRouteIndex } = this.state;
    const { nodeError, status, isDarkMode } = this.props;
    const img = isDarkMode ? rightDecorationWhite : rightDecoration;
    const settings = isDarkMode ? settingsIconBlack : settingsIcon;
    const getCoins = isDarkMode ? getCoinsIconBlack : getCoinsIcon;
    const help = isDarkMode ? helpIconBlack : helpIcon;
    const signOut = isDarkMode ? signOutIconBlack : signOutIcon;
    const bntStyle = { marginRight: 15, marginTop: 10 };
    const bgColor = isDarkMode ? smColors.white : smColors.black;

    return (
      <Wrapper>
        <Logo isDarkMode={isDarkMode} />
        <InnerWrapper>
          <NavBar>
            <NavBarPart>
              <NavLinksWrapper>
                <TooltipWrapper>
                  <NavBarLink onClick={() => this.handleNavigation({ index: 0 })} isActive={activeRouteIndex === 0}>
                    SMESHING
                  </NavBarLink>
                  <CustomTooltip text="MANAGE SMESHING" isDarkMode={isDarkMode} />
                </TooltipWrapper>
                <TooltipWrapper>
                  <NavBarLink onClick={() => this.handleNavigation({ index: 1 })} isActive={activeRouteIndex === 1}>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    <NetworkIndicator color={nodeError ? smColors.red : status?.isSynced ? smColors.green : smColors.orange} />
                    NETWORK
                  </NavBarLink>
                  <CustomTooltip text="NETWORK" isDarkMode={isDarkMode} />
                </TooltipWrapper>
                <TooltipWrapper>
                  <NavBarLink onClick={() => this.handleNavigation({ index: 2 })} isActive={activeRouteIndex === 2}>
                    WALLET
                  </NavBarLink>
                  <CustomTooltip text="SEND / RECEIVE SMH" isDarkMode={isDarkMode} />
                </TooltipWrapper>
                <TooltipWrapper>
                  <NavBarLink onClick={() => this.handleNavigation({ index: 3 })} isActive={activeRouteIndex === 3}>
                    CONTACTS
                  </NavBarLink>
                  <CustomTooltip text="MANAGE CONTACTS" isDarkMode={isDarkMode} />
                </TooltipWrapper>
                <TooltipWrapper>
                  <NavBarLink onClick={() => this.handleNavigation({ index: 4 })} isActive={activeRouteIndex === 4}>
                    DASH
                  </NavBarLink>
                  <CustomTooltip text="DASHBOARD" isDarkMode={isDarkMode} />
                </TooltipWrapper>
              </NavLinksWrapper>
            </NavBarPart>
            <NavBarPart>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleNavigation({ index: 5 })}
                  img={settings}
                  imgHeight={30}
                  imgWidth={30}
                  isPrimary={activeRouteIndex === 5}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="SETTINGS" isDarkMode={isDarkMode} />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleNavigation({ index: 6 })}
                  img={getCoins}
                  imgHeight={30}
                  imgWidth={30}
                  isPrimary={false}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="GET SMESH" isDarkMode={isDarkMode} />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleNavigation({ index: 7 })}
                  img={help}
                  imgHeight={30}
                  imgWidth={30}
                  isPrimary={false}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="HELP" isDarkMode={isDarkMode} />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleNavigation({ index: 8 })}
                  img={signOut}
                  imgHeight={30}
                  imgWidth={30}
                  isPrimary={false}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="LOGOUT" isDarkMode={isDarkMode} />
              </TooltipWrapper>
            </NavBarPart>
          </NavBar>
          {nodeError ? <InfoBanner /> : <EmptySpace />}
          <RoutesWrapper>
            <Switch>
              {routes.main.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
            </Switch>
          </RoutesWrapper>
        </InnerWrapper>
        <RightDecoration src={img} />
      </Wrapper>
    );
  }

  componentDidMount() {
    const { getNetworkDefinitions, getVersionAndBuild } = this.props;
    // @ts-ignore
    getNetworkDefinitions();
    // @ts-ignore
    getVersionAndBuild();
  }

  static getDerivedStateFromProps(props: Props, prevState: State) {
    const { pathname } = props.location;
    if (pathname.indexOf('backup') !== -1 || pathname.indexOf('transactions') !== -1) {
      return { activeRouteIndex: -1 };
    } else if (pathname.indexOf('contacts') !== -1) {
      return { activeRouteIndex: 3 };
    } else if (pathname.indexOf('send-coins') !== -1 && prevState.activeRouteIndex === 3) {
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
        case 3:
        case 4:
        case 5: {
          this.setState({ activeRouteIndex: index });
          this.navMap[index]();
          break;
        }
        case 6:
        case 7: {
          this.navMap[index]();
          break;
        }
        case 8: {
          // @ts-ignore
          history.push('/auth/unlock', { isLoggedOut: true });
          logout();
          break;
        }
        default:
          break;
      }
    }
  };

  // approveTxNotifier = () => {
  //   // TODO: move to main process when API 2.0 is ready
  //   // const { history } = this.props;
  //   // notificationsService.notify({
  //   //   title: 'Spacemesh',
  //   //   notification: `${hasConfirmedIncomingTxs ? 'Incoming' : 'Sent'} transaction approved`,
  //   //   // @ts-ignore
  //   //   callback: () => history.push('/main/transactions'),
  //   //   tag: 1
  //   // });
  // };
  //
  // newRewardsNotifier = () => {
  //   // TODO: move to main process when API 2.0 is ready
  //   // notificationsService.notify({
  //   //   title: 'Spacemesh',
  //   //   notification: 'Received a reward for smeshing!',
  //   //   callback: () => this.handleNavigation({ index: 0 }),
  //   //   tag: 2
  //   // });
  // };
}

const mapStateToProps = (state: RootState) => ({
  status: state.node.status,
  nodeError: state.node.error,
  isDarkMode: state.ui.isDarkMode
});

const mapDispatchToProps = {
  getNetworkDefinitions,
  getVersionAndBuild,
  logout
};

// @ts-ignore
Main = connect(mapStateToProps, mapDispatchToProps)(Main);

export default ScreenErrorBoundary(Main);
