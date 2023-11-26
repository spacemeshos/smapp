import React, { ReactNode, useEffect, useState } from 'react';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import styled, { DefaultTheme, useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/actions';
import { Logo } from '../../components/common';
import {
  SecondaryButton,
  NavTooltip,
  SmallHorizontalPanel,
  BoldText,
  ColorStatusIndicator,
} from '../../basicComponents';
import { AuthPath, MainPath } from '../../routerPaths';
import * as SmesherSelectors from '../../redux/smesher/selectors';
import routes from '../../routes';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import Version from '../../components/common/Version';
import { eventsService } from '../../infra/eventsService';
import { ExternalLinks } from '../../../shared/constants';
import { isWalletOnly } from '../../redux/wallet/selectors';
import { getNetworkTapBotDiscordURL } from '../../redux/network/selectors';

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

const navRoutes = [
  MainPath.Smeshing,
  MainPath.Network,
  MainPath.Wallet,
  MainPath.Contacts,
  MainPath.Dashboard,
  MainPath.Settings,
];

const getSmeshingIndicatorColor = (
  isSmeshing: boolean,
  isCreatingPostData: boolean,
  isSmeshingPaused: boolean,
  isErrorState: boolean
) => {
  if (isCreatingPostData) {
    return smColors.orange;
  }

  if (isSmeshingPaused || isErrorState) {
    return smColors.red;
  }

  if (isSmeshing) {
    return smColors.green;
  }

  return smColors.lighterGray;
};

const getNetworkIndicatorColor = (nodeError, genesisID, isSynced) => {
  if (nodeError || !genesisID.length) {
    return smColors.red;
  }
  if (isSynced) {
    return smColors.green;
  }
  return smColors.orange;
};

const Main = () => {
  const isWalletOnlyMode = useSelector(isWalletOnly);
  const status = useSelector((state: RootState) => state.node.status);
  const nodeError = useSelector((state: RootState) => state.node.error);
  const genesisID = useSelector((state: RootState) => state.network.genesisID);
  const isSmeshing = useSelector(SmesherSelectors.isSmeshing);
  const isCreatingPostData = useSelector(SmesherSelectors.isCreatingPostData);
  const isSmeshingPaused = useSelector(SmesherSelectors.isSmeshingPaused);
  const isErrorState = useSelector(SmesherSelectors.isErrorState);
  const tapBotURL = useSelector(getNetworkTapBotDiscordURL);

  const history = useHistory();

  const location = useLocation();

  const theme = useTheme();

  const dispatch = useDispatch();

  const [activeRouteIndex, setActiveRouteIndex] = useState(
    location.pathname.includes('/wallet') ? 2 : 0
  );

  useEffect(() => {
    const nextActiveIndex = navRoutes.findIndex((route) =>
      location.pathname.startsWith(route)
    );
    setActiveRouteIndex(nextActiveIndex);
  }, [location]);

  useEffect(() => {
    !isWalletOnlyMode && eventsService.requestVersionAndBuild();
  }, [isWalletOnlyMode]);

  const getRouteIndex = (route: string) =>
    navRoutes.findIndex((navRoute) => navRoute.startsWith(route));

  const handleLogOut = () => {
    history.push(AuthPath.Unlock, { isLoggedOut: true });
    dispatch(logout());
  };

  const isActive = (route: string) => {
    const index = getRouteIndex(route);
    return activeRouteIndex === index;
  };

  const handleNavRoute = (route: string) => {
    if (isActive(route)) return;
    history.push(navRoutes[getRouteIndex(route)]);
  };

  const handleOpenLink = (url: string) => window.open(url);

  type LabelType = string | ReactNode;

  const renderNavBarLink = (
    label: LabelType,
    tooltip: string,
    route: string
  ) => {
    return (
      <TooltipWrapper>
        <NavBarLink
          onClick={() => handleNavRoute(route)}
          isActive={isActive(route)}
        >
          {label}
        </NavBarLink>
        <CustomTooltip text={tooltip} />
      </TooltipWrapper>
    );
  };

  const { settings, getCoins, help, signOut } = theme.icons;

  const bgColor = theme.color.primary;
  const bntStyle = { marginRight: 15, marginTop: 10 };

  return (
    <Wrapper>
      <Logo />
      <InnerWrapper>
        <NavBar>
          <NavBarPart>
            <NavLinksWrapper>
              {renderNavBarLink(
                <>
                  <ColorStatusIndicator
                    color={getSmeshingIndicatorColor(
                      isSmeshing,
                      isCreatingPostData,
                      isSmeshingPaused,
                      isErrorState
                    )}
                  />
                  SMESHING
                </>,
                'MANAGE SMESHING',
                MainPath.Smeshing
              )}
              {renderNavBarLink(
                <>
                  <ColorStatusIndicator
                    color={getNetworkIndicatorColor(
                      nodeError,
                      genesisID,
                      status?.isSynced
                    )}
                  />
                  NETWORK
                </>,
                'NETWORK',
                MainPath.Network
              )}
              {renderNavBarLink(
                'WALLET',
                'SEND / RECEIVE SMH',
                MainPath.Wallet
              )}
              {renderNavBarLink(
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
                onClick={() => handleNavRoute(MainPath.Settings)}
                img={settings}
                imgHeight={25}
                imgWidth={25}
                isPrimary={isActive(MainPath.Settings)}
                width={35}
                height={35}
                style={bntStyle}
                bgColor={bgColor}
              />
              <CustomTooltip text="SETTINGS" closePosition />
            </TooltipWrapper>
            {tapBotURL && (
              <TooltipWrapper>
                <SecondaryButton
                  onClick={() => handleOpenLink(ExternalLinks.GetCoinGuide)}
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
            )}
            <TooltipWrapper>
              <SecondaryButton
                onClick={() => handleOpenLink(ExternalLinks.Help)}
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
                onClick={handleLogOut}
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
                path={route.path as MainPath.Main}
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
};

export default Main;
