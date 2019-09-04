// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { logout } from '/redux/auth/actions';
import { getMiningStatus, getGenesisTime } from '/redux/node/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { OfflineBanner } from '/components';
import { SecondaryButton, Tooltip } from '/basicComponents';
import routes from '/routes';
import { notificationsService } from '/infra/notificationsService';
import { logo, sideBar, settingsIcon, getCoinsIcon, helpIcon, signOutIcon } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 5px 25px 20px 10px;
  background-color: ${smColors.white};
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
  margin-right: 10px;
`;

const NavLinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-left: 30px;
`;

const NavBarLink = styled.div`
  margin-right: 15px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  text-decoration-line: ${({ isActive }) => (isActive ? 'underline' : 'none')};
  text-transform: uppercase;
  color: ${({ isActive }) => (isActive ? smColors.purple : smColors.disabledGray)};
  cursor: pointer;
`;

const Logo = styled.img`
  display: block;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

const SideBar = styled.img`
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 100%;
`;

const InnerWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${smColors.white};
`;

const CustomTooltip = styled(Tooltip)`
  top: ${({isLinkTooltip}) => isLinkTooltip ? 30 : 57}px;
  right: -8px;
  width: 90px;
  text-align: center;
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
  getMiningStatus: Action,
  getGenesisTime: Action,
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
        <SideBar src={sideBar} />
        <NavBar>
          <NavBarPart>
            <Logo src={logo} onClick={() => shell.openExternal('https://spacemesh.io')} />
            <NavLinksWrapper>
              <TooltipWrapper>
                <NavBarLink onClick={() => this.handleNavigation({ index: 0 })} isActive={activeRouteIndex === 0}>MINING</NavBarLink>
                <CustomTooltip text="SETUP OR MANAGE YOUR MINING" withIcon={false} isLinkTooltip />
              </TooltipWrapper>
              <TooltipWrapper>
                <NavBarLink onClick={() => this.handleNavigation({ index: 1 })} isActive={activeRouteIndex === 1}>WALLET</NavBarLink>
                <CustomTooltip text="SEND / RECEIVE SMC" withIcon={false} isLinkTooltip />
              </TooltipWrapper>
              <TooltipWrapper>
                <NavBarLink onClick={() => this.handleNavigation({ index: 2 })} isActive={activeRouteIndex === 2}>CONTACTS</NavBarLink>
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
              <SecondaryButton onClick={() => this.handleNavigation({ index: 4 })} img={getCoinsIcon} imgHeight={30} imgWidth={30} isPrimary={false} width={35} height={35} style={bntStyle} />
              <CustomTooltip text="GET COINS" withIcon={false} />
            </TooltipWrapper>
            <TooltipWrapper>
              <SecondaryButton onClick={() => this.handleNavigation({ index: 5 })} img={helpIcon} imgHeight={30} imgWidth={30} isPrimary={false} width={35} height={35} style={bntStyle} />
              <CustomTooltip text="HELP" withIcon={false} />
            </TooltipWrapper>
            <TooltipWrapper>
              <SecondaryButton onClick={() => this.handleNavigation({ index: 6 })} img={signOutIcon} imgHeight={30} imgWidth={30} isPrimary={false} width={35} height={35} style={bntStyle} />
              <CustomTooltip text="LOGOUT" withIcon={false} />
            </TooltipWrapper>
          </NavBarPart>
        </NavBar>
        <InnerWrapper>
          {!isConnected && isOfflineBannerVisible && <OfflineBanner closeBanner={() => this.setState({ isOfflineBannerVisible: false })} />}
          <Switch>
            {routes.main.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
          </Switch>
        </InnerWrapper>
      </Wrapper>
    );
  }

  componentDidMount() {
    const { isConnected, miningStatus, getMiningStatus } = this.props;
    if (isConnected && miningStatus === nodeConsts.NOT_MINING) {
      getMiningStatus();
    }
    if (isConnected && miningStatus === nodeConsts.IS_MINING) {
      getGenesisTime();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isConnected, miningStatus, getMiningStatus, getGenesisTime } = this.props;
    if (isConnected && prevProps.miningStatus === nodeConsts.IN_SETUP) {
      getGenesisTime();
      this.miningStatusInterval = setInterval(() => getMiningStatus, 3600000);
    }
    if (isConnected && [nodeConsts.NOT_MINING, nodeConsts.IN_SETUP].includes(prevProps.miningStatus) && miningStatus === nodeConsts.IS_MINING) {
      clearInterval(this.miningStatusInterval);
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Your full node setup is complete! You are now participating in the Spacemesh network…!',
        callback: () => this.handleNavigation({ index: 0 })
      });
    }
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
          history.push('/');
          logout();
          break;
        }
        default: break;
      }
    }
  };
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  miningStatus: state.node.miningStatus
});

const mapDispatchToProps = {
  getMiningStatus,
  getGenesisTime,
  logout
};

Main = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(Main);

Main = ScreenErrorBoundary(Main);
export default Main;
