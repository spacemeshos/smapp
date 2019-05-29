// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { checkNetworkConnection } from '/redux/network/actions';
import { SmButton } from '/basicComponents';
import { smColors } from '/vars';
import type { Action } from '/types';
import { communication } from '/assets/images';
import { shell } from 'electron';
import { NoNetworkSection, NetworkEntry, SetNodeIP } from '/components/network';
import type { NetworkEntryType } from '/components/network';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 60px;
`;

const Header = styled.span`
  font-size: 31px;
  line-height: 42px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
  margin-bottom: 27px;
`;

const RightPaneHeader = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${smColors.darkGray};
  line-height: 19px;
  margin-bottom: 35px;
`;

// $FlowStyledIssue
const Text = styled.span`
  font-size: 16px;
  color: ${({ color }) => `${color || smColors.lighterBlack}`};
  line-height: 22px;
`;

const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const RightPaneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  flex: 1;
  border: 1px solid ${smColors.borderGray};
  overflow-y: scroll;
`;

const LeftPaneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 2;
  margin-right: 97px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-height: 270px;
  min-height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const ActionLink = styled(Text)`
  margin-top: 30px;
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Separator = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid ${smColors.borderGray};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {
  checkNetworkConnection: Action,
  isConnected: boolean
};

type State = {
  networks: NetworkEntryType[],
  shouldShowModal: boolean
};

class Network extends Component<Props, State> {
  timer: any;

  state = {
    networks: [
      {
        name: 'Test net',
        color: smColors.orange,
        status: 'connected'
      },
      {
        name: 'Private net',
        color: smColors.red,
        status: null
      },
      {
        name: 'Sky net',
        color: smColors.lighterBlack,
        status: null
      }
    ],
    shouldShowModal: false
  };

  render() {
    const { isConnected } = this.props;
    const { networks, shouldShowModal } = this.state;
    return [
      <Wrapper key="wrapper">
        <Header>Network</Header>
        <BodyWrapper>
          <LeftPaneWrapper>
            {!isConnected && <NoNetworkSection />}
            <Separator />
            {networks.map((networkEntry: NetworkEntryType) => (
              <NetworkEntry key={networkEntry.name} connectToNetwork={this.connectToNetwork} networkEntry={networkEntry} isConnected={isConnected} />
            ))}
            <ButtonsWrapper>
              <SmButton text="Create a new network" theme="green" onPress={() => {}} isDisabled style={{ width: 222, marginTop: 30, marginRight: 20 }} />
              <SmButton text="Set Node IP" theme="orange" onPress={() => this.setState({ shouldShowModal: true })} style={{ width: 222, marginTop: 30 }} />
            </ButtonsWrapper>
          </LeftPaneWrapper>
          {this.renderRightPane()}
        </BodyWrapper>
      </Wrapper>,
      shouldShowModal && <SetNodeIP key="modal" closeModal={this.handleCloseModal} />
    ];
  }

  componentDidMount() {
    const { checkNetworkConnection } = this.props;
    const networkCheckInterval = 30000;
    checkNetworkConnection();
    this.timer = setInterval(() => {
      checkNetworkConnection();
    }, networkCheckInterval);
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  renderRightPane = () => (
    <RightPaneWrapper>
      <ImageWrapper>
        <Image src={communication} />
      </ImageWrapper>
      <RightPaneHeader>Spacemesh Network</RightPaneHeader>
      <Text>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
        accusam et justo duo dolores et ea.
      </Text>
      <ActionLink onClick={this.navigateToExplanation}>Learn more about Spacemesh Network</ActionLink>
    </RightPaneWrapper>
  );

  handleCloseModal = () => {
    const { checkNetworkConnection } = this.props;
    this.setState({ shouldShowModal: false });
    checkNetworkConnection();
  };

  connectToNetwork = ({ networkName }: { networkName: string }) => {
    // TODO: connect to actual connect to network action
    const { networks } = this.state;
    const connectedNetworkIndex = networks.findIndex((networkEntry: NetworkEntryType) => networkEntry.name === networkName);
    this.setState({
      networks: networks.map((networkEntry: NetworkEntryType, index: number) => ({
        ...networkEntry,
        status: connectedNetworkIndex === index ? 'connected' : null
      }))
    });
  };

  navigateToExplanation = () => shell.openExternal('https://testnet.spacemesh.io/'); // TODO: connect to actual link for network connect info
}

const mapStateToProps = (state) => ({
  isConnected: state.network.isConnected
});

const mapDispatchToProps = {
  checkNetworkConnection
};

Network = connect(
  mapStateToProps,
  mapDispatchToProps
)(Network);

export default Network;
