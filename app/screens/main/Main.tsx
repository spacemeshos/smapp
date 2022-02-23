import React, { Component, ReactNode } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { logout } from '../../redux/auth/actions';
import { Logo } from '../../components/common';
import { SecondaryButton, NavTooltip, NetworkIndicator, SmallHorizontalPanel } from '../../basicComponents';
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
  signOutIconBlack,
} from '../../assets/images';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import Version from '../../components/common/Version';
import { NodeError, NodeStatus } from '../../../shared/types';
import { eventsService } from '../../infra/eventsService';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { getNetworkDefinitions } from '../../redux/network/actions';

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
  margin-bottom: 60px;
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

interface Props extends RouteComponentProps {
  isWalletOnly: boolean;
  status: NodeStatus | null;
  logout: any;
  getNetworkDefinitions: () => void;
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: unknown;
  };
  nodeError: NodeError | null;
  isDarkMode: boolean;
  netId: number;
}

type State = {
  activeRouteIndex: number;
};

class Main extends Component<Props, State> {
  private static readonly navRoutes = ['/main/node', '/main/network', '/main/wallet', '/main/contacts', '/main/dash', '/main/settings'];

  constructor(props: Props) {
    super(props);
    const { location } = props;
    const isWalletLocation = location.pathname.includes('/wallet');
    const activeRouteIndex = isWalletLocation ? 2 : 0;
    this.state = {
      activeRouteIndex,
    };
  }

  render() {
    const { isWalletOnly, nodeError, status, isDarkMode, netId } = this.props;
    const img = isDarkMode ? rightDecorationWhite : rightDecoration;
    const settings = isDarkMode ? settingsIconBlack : settingsIcon;
    const getCoins = isDarkMode ? getCoinsIconBlack : getCoinsIcon;
    const help = isDarkMode ? helpIconBlack : helpIcon;
    const signOut = isDarkMode ? signOutIconBlack : signOutIcon;
    const bntStyle = { marginRight: 15, marginTop: 10 };
    const bgColor = isDarkMode ? smColors.white : smColors.black;
    // eslint-disable-next-line no-nested-ternary
    const indicatorColor = nodeError || netId === -1 ? smColors.red : isWalletOnly || status?.isSynced ? smColors.green : smColors.orange;

    return (
      <Wrapper>
        <Logo isDarkMode={isDarkMode} />
        <InnerWrapper>
          <NavBar>
            <NavBarPart>
              <NavLinksWrapper>
                {this.renderNavBarLink('SMESHING', 'MANAGE SMESHING', '/main/node')}
                {this.renderNavBarLink(
                  <>
                    <NetworkIndicator color={indicatorColor} />
                    NETWORK
                  </>,
                  'NETWORK',
                  '/main/network'
                )}
                {this.renderNavBarLink('WALLET', 'SEND / RECEIVE SMH', '/main/wallet')}
                {this.renderNavBarLink('CONTACTS', 'MANAGE CONTACTS', '/main/contacts')}
                {this.renderNavBarLink('DASH', 'DASHBOARD', '/main/dash')}
              </NavLinksWrapper>
            </NavBarPart>
            <NavBarPart>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleNavRoute('/main/settings')}
                  img={settings}
                  imgHeight={30}
                  imgWidth={30}
                  isPrimary={this.isActive('/main/settings')}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="SETTINGS" isDarkMode={isDarkMode} />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleOpenLink('https://testnet.spacemesh.io/#/get_coin')}
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
                  onClick={() => this.handleOpenLink('https://testnet.spacemesh.io/#/help')}
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
                  onClick={this.handleLogOut}
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
          <RoutesWrapper>
            <SmallHorizontalPanel isDarkMode={isDarkMode} />
            <Switch>
              {routes.main.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
            </Switch>
          </RoutesWrapper>
        </InnerWrapper>
        <Version />
        <RightDecoration src={img} />
      </Wrapper>
    );
  }

  componentDidMount() {
    const { isWalletOnly, getNetworkDefinitions } = this.props;
    !isWalletOnly && eventsService.requestVersionAndBuild();
    getNetworkDefinitions();
  }

  renderNavBarLink = (label: string | ReactNode, tooltip: string, route: string) => {
    const { isDarkMode } = this.props;
    return (
      <TooltipWrapper>
        <NavBarLink onClick={() => this.handleNavRoute(route)} isActive={this.isActive(route)}>
          {label}
        </NavBarLink>
        <CustomTooltip text={tooltip} isDarkMode={isDarkMode} />
      </TooltipWrapper>
    );
  };

  static getDerivedStateFromProps(props: Props) {
    const { pathname } = props.location;
    const nextActiveIndex = Main.navRoutes.findIndex((route) => pathname.startsWith(route));
    return { activeRouteIndex: nextActiveIndex };
  }

  getRouteIndex = (route: string) => Main.navRoutes.findIndex((navRoute) => navRoute.startsWith(route));

  handleNavRoute = (route: string) => {
    if (this.isActive(route)) return;
    const { history } = this.props;
    const index = this.getRouteIndex(route);
    history.push(Main.navRoutes[index]);
  };

  handleOpenLink = (url: string) => {
    window.open(url);
  };

  handleLogOut = () => {
    const { history, logout } = this.props;
    history.push('/auth/unlock', { isLoggedOut: true });
    logout();
  };

  isActive = (route: string) => {
    const { activeRouteIndex } = this.state;
    const index = this.getRouteIndex(route);
    return activeRouteIndex === index;
  };
}

const mapStateToProps = (state: RootState) => ({
  isWalletOnly: isWalletOnly(state),
  status: state.node.status,
  nodeError: state.node.error,
  netId: state.network.netId,
  isDarkMode: state.ui.isDarkMode,
});

const mapDispatchToProps = {
  logout,
  getNetworkDefinitions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
