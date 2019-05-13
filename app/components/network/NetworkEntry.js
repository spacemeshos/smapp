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

export type NetworkEntryType = {
  name: string,
  status: 'loading' | 'connected' | null,
  color: string
};

type Props = {
  connectToNetwork: ({ networkName: string }) => void,
  isConnected: boolean,
  networkEntry: NetworkEntryType
};

class NetworkEntry extends PureComponent<Props> {
  render() {
    const { connectToNetwork, isConnected, networkEntry } = this.props;
    const isNetworkConnected = isConnected && networkEntry.status === 'connected';
    const isLoading = networkEntry.status === 'loading';
    return (
      <NetworkEntryWrapper isConnected={isNetworkConnected} onClick={() => (isConnected ? connectToNetwork({ networkName: networkEntry.name }) : null)}>
        <NetworkIdentifier color={networkEntry.color} />
        <NetworkName isConnected={isNetworkConnected}>{networkEntry.name}</NetworkName>
        <ConnectionStatus>{isNetworkConnected ? 'Connected' : 'Connect'}</ConnectionStatus>
        <ConnectionStatusIconWrapper>
          {isNetworkConnected && <ConnectedIcon src={checkGreen} />}
          {isLoading && <LoaderIcon src={loader} />}
        </ConnectionStatusIconWrapper>
      </NetworkEntryWrapper>
    );
  }
}

export default NetworkEntry;
