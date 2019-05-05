import React, { PureComponent } from 'react';
import styled from 'styled-components';
import smColors from '/vars/colors';
import { checkGreen, loader } from '/assets/images';

const Text = styled.span`
  font-size: 16px;
  color: ${smColors.lighterBlack};
  line-height: 22px;
`;

// $FlowStyledIssue
// const ExplanationWrapper = styled.div`
//   height: ${({ isExpanded }) => (isExpanded ? '44' : '0')}px;
//   opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
//   transition: all 0.2s linear;
// `;

// $FlowStyledIssue
const NetworkEntryWrapper = styled.div`
  padding: 0 12px;
  border-bottom: 1px solid ${smColors.borderGray};
  width: 100%;
  height: 90px;
  line-height: 90px;
  display: flex;
  flex-direction: row;
  background-color: ${({ isConnected }) => (isConnected ? smColors.green10alpha : smColors.white)};
`;

const Separator = styled.div`
  margin-top: 20px;
  border-bottom: 1px solid ${smColors.borderGray};
`;

// $FlowStyledIssue
const NetworkIdentifier = styled.div`
  width: 20px;
  height: 20px;
  border: 4px solid ${({ color }) => color};
  border-radius: 10px;
  align-self: center;
  margin-right: 30px;
`;

// $FlowStyledIssue
const NetworkName = styled(Text)`
  line-height: 90px;
  flex: 1;
  color: ${({ isConnected }) => (isConnected ? smColors.green : smColors.lighterBlack)};
`;

const ConnectionStatusIconWrapper = styled.div`
  width: 30px;
  padding: 0 10px;
`;

const ConnectionStatus = styled(Text)`
  line-height: 90px;
  float: right;
  color: ${smColors.green};
  width: 80px;
`;

const ConnectedIcon = styled.img`
  width: 10px;
  height: 7px;
`;

const LoaderIcon = styled.img`
  width: 25px;
  height: 25px;
  margin-top: 32px;
`;

type NetworkEntry = {
  name: string,
  status: ?'loading' | 'connected',
  color: string
};

type Props = {
  connectToNetwork: ({ networkName: string }) => void,
  isNetworkConnected: boolean,
  networks: NetworkEntry[]
};

class NetworkList extends PureComponent<Props> {
  render() {
    const { isNetworkConnected, networks } = this.props;
    return (
      <React.Fragment>
        <Separator />
        {networks && networks.map((networkEntry: NetworkEntry) => this.renderNetworkEntry({ networkEntry, isNetworkConnected }))}
      </React.Fragment>
    );
  }

  renderNetworkEntry = ({ networkEntry, isNetworkConnected }: { networkEntry: NetworkEntry, isNetworkConnected: boolean }) => {
    const { connectToNetwork } = this.props;
    const isConnected = isNetworkConnected && networkEntry.status === 'connected';
    const isLoading = networkEntry.status === 'loading';
    return (
      <NetworkEntryWrapper key={networkEntry.name} isConnected={isConnected} onClick={() => connectToNetwork({ networkName: networkEntry.name })}>
        <NetworkIdentifier color={networkEntry.color} />
        <NetworkName isConnected={isConnected}>{networkEntry.name}</NetworkName>
        <ConnectionStatus>{isConnected ? 'Connected' : 'Connect'}</ConnectionStatus>
        <ConnectionStatusIconWrapper>
          {isConnected && <ConnectedIcon src={checkGreen} />}
          {isLoading && <LoaderIcon src={loader} />}
        </ConnectionStatusIconWrapper>
      </NetworkEntryWrapper>
    );
  };

  toggleNoNetworkExplanation = () => {
    this.setState((prevState) => {
      return { showNoNetworkExplanation: !prevState.showNoNetworkExplanation };
    });
  };
}

export default NetworkList;
