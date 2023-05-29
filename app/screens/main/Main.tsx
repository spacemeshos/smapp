import React, { Component, ReactNode } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import styled, { DefaultTheme, withTheme } from 'styled-components';
import { connect } from 'react-redux';
import { logout } from '../../redux/auth/actions';
import { Logo } from '../../components/common';
import {
  SecondaryButton,
  NavTooltip,
  NetworkIndicator,
  SmallHorizontalPanel,
  BoldText,
} from '../../basicComponents';
import { AuthPath, MainPath } from '../../routerPaths';
import routes from '../../routes';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import Version from '../../components/common/Version';
import { NodeError, NodeStatus } from '../../../shared/types';
import { eventsService } from '../../infra/eventsService';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { ExternalLinks } from '../../../shared/constants';

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

const getNavLinkColorTheme = (theme: DefaultTheme, isActive?: boolean) => {
  let { color } = theme.navBar;
  color = theme.isDarkMode ? smColors.navLinkGrey : color;
  return isActive ? smColors.purple : color;
};

const NavBarLink = styled(BoldText)<{ isActive?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 15px;
  font-size: 12px;
  line-height: 15px;
  text-decoration-line: ${({ isActive }) => (isActive ? 'underline' : 'none')};
  text-transform: uppercase;
  color: ${({ isActive, theme }) => getNavLinkColorTheme(theme, isActive)};
  cursor: pointer;
`;

const RightDecoration = styled.img.attrs((props) => ({
  src: props.theme.icons.pageLeftSideBar,
}))`
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

const CustomTooltip = styled(NavTooltip)<{ closePosition?: boolean }>`
  bottom: ${({ closePosition }) => (closePosition ? '-25px' : '-45px')};
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
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: unknown;
  };
  nodeError: NodeError | null;
  isDarkMode: boolean;
  genesisID: string;
  theme: DefaultTheme;
}

type State = {
  activeRouteIndex: number;
};

class Main extends Component<Props, State> {
  private static readonly navRoutes = [
    MainPath.Smeshing,
    MainPath.Network,
    MainPath.Wallet,
    MainPath.Contacts,
    MainPath.Dashboard,
    MainPath.Settings,
  ];

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
    const { nodeError, status, genesisID, theme } = this.props;

    const { settings, getCoins, help, signOut } = theme.icons;
    const bgColor = theme.color.primary;
    const bntStyle = { marginRight: 15, marginTop: 10 };
    /* eslint-disable no-nested-ternary */
    const indicatorColor =
      nodeError || !genesisID.length
        ? smColors.red
        : status?.isSynced
        ? smColors.green
        : smColors.orange;
    /* eslint-enable no-nested-ternary */

    return (
      <Wrapper>
        <Logo />
        <InnerWrapper>
          <NavBar>
            <NavBarPart>
              <NavLinksWrapper>
                {this.renderNavBarLink(
                  'SMESHING',
                  'MANAGE SMESHING',
                  MainPath.Smeshing
                )}
                {this.renderNavBarLink(
                  <>
                    <NetworkIndicator color={indicatorColor} />
                    NETWORK
                  </>,
                  'NETWORK',
                  MainPath.Network
                )}
                {this.renderNavBarLink(
                  'WALLET',
                  'SEND / RECEIVE SMH',
                  MainPath.Wallet
                )}
                {this.renderNavBarLink(
                  'CONTACTS',
                  'MANAGE CONTACTS',
                  MainPath.Contacts
                )}
                {/*
                TODO: Do not render dashboard link since it is not supports new
                tx&accounts structure. Should be returned back when it will work.
                {this.renderNavBarLink('DASH', 'DASHBOARD', MainPath.Dashboard)}
                */}
              </NavLinksWrapper>
            </NavBarPart>
            <NavBarPart>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleNavRoute(MainPath.Settings)}
                  img={settings}
                  imgHeight={25}
                  imgWidth={25}
                  isPrimary={this.isActive(MainPath.Settings)}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="SETTINGS" closePosition />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() =>
                    this.handleOpenLink(ExternalLinks.GetCoinGuide)
                  }
                  img={getCoins}
                  imgHeight={25}
                  imgWidth={25}
                  isPrimary={false}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="GET SMESH" closePosition />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => this.handleOpenLink(ExternalLinks.Help)}
                  img={help}
                  imgHeight={25}
                  imgWidth={25}
                  isPrimary={false}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="HELP" closePosition />
              </TooltipWrapper>
              <TooltipWrapper>
                <SecondaryButton
                  onClick={this.handleLogOut}
                  img={signOut}
                  imgHeight={25}
                  imgWidth={25}
                  isPrimary={false}
                  width={35}
                  height={35}
                  style={bntStyle}
                  bgColor={bgColor}
                />
                <CustomTooltip text="LOGOUT" closePosition />
              </TooltipWrapper>
            </NavBarPart>
          </NavBar>
          <RoutesWrapper>
            <SmallHorizontalPanel />
            <Switch>
              {routes.main.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  component={route.component}
                />
              ))}
            </Switch>
          </RoutesWrapper>
        </InnerWrapper>
        <Version />
        <RightDecoration />
      </Wrapper>
    );
  }

  componentDidMount() {
    const { isWalletOnly } = this.props;
    !isWalletOnly && eventsService.requestVersionAndBuild();
  }

  renderNavBarLink = (
    label: string | ReactNode,
    tooltip: string,
    route: string
  ) => {
    return (
      <TooltipWrapper>
        <NavBarLink
          onClick={() => this.handleNavRoute(route)}
          isActive={this.isActive(route)}
        >
          {label}
        </NavBarLink>
        <CustomTooltip text={tooltip} />
      </TooltipWrapper>
    );
  };

  static getDerivedStateFromProps(props: Props) {
    const { pathname } = props.location;
    const nextActiveIndex = Main.navRoutes.findIndex((route) =>
      pathname.startsWith(route)
    );
    return { activeRouteIndex: nextActiveIndex };
  }

  getRouteIndex = (route: string) =>
    Main.navRoutes.findIndex((navRoute) => navRoute.startsWith(route));

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
    history.push(AuthPath.Unlock, { isLoggedOut: true });
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
  genesisID: state.network.genesisID,
  isDarkMode: state.ui.isDarkMode,
});

const mapDispatchToProps = {
  logout,
};

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Main));
