// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Button } from '/basicComponents';
import { getAddress } from '/infra/utils';
import { copyToClipboard } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { Account } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 610px;
  height: 100%;
  padding: 15px 25px;
  background-color: ${smColors.black02Alpha};
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
  cursor: inherit;
`;

const TextElement = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
  cursor: inherit;
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const AddressText = styled(Text)`
  color: ${smColors.blue};
  text-decoration: underline;
`;

const CopyIcon = styled.img`
  width: 16px;
  height: 15px;
  margin: 0 10px;
  cursor: inherit;
`;

const CopiedText = styled(Text)`
  font-weight: SourceCodeProBold;
  color: ${smColors.green};
`;

const ComplexText = styled.div`
  display: flex;
  flex-direction: row;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

type Props = {
  location: { state: { account: Account, miningStatus: string } },
  history: RouterHistory
};

type State = {
  isCopied: boolean
};

class RequestCoins extends Component<Props, State> {
  copiedTimeout: TimeoutID;

  state = {
    isCopied: false
  };

  render() {
    const {
      location: {
        state: { account, miningStatus }
      },
      history
    } = this.props;
    const { isCopied } = this.state;
    return (
      <Wrapper>
        <Header>
          Request SMH
          <br />
          --
        </Header>
        <SubHeader>
          <Text>Request SMH by sharing your wallet&apos;s address:</Text>
          <AddressWrapper onClick={this.copyPublicAddress}>
            <AddressText>{`0x${getAddress(account.publicKey)}`}</AddressText>
            <CopyIcon src={copyToClipboard} />
            {isCopied && <CopiedText>Address copied!</CopiedText>}
          </AddressWrapper>
        </SubHeader>
        <Text>* This address is public and safe to share with anyone.</Text>
        <Text>* Send this address to anyone you want to receive Smesh from.</Text>
        <ComplexText>
          <Text>* You may also paste this address in the&nbsp;</Text>
          <Link onClick={this.navigateToTap} text="Testnet Tap" style={{ fontSize: 16, lineHeight: '22px' }} />
          <TextElement>.</TextElement>
        </ComplexText>
        <br />
        {miningStatus === nodeConsts.NOT_MINING && (
          <ComplexText>
            <Text>To earn Smesh&nbsp;</Text>
            <Link onClick={this.navigateToNodeSetup} text="set up Smeshing" style={{ fontSize: 16, lineHeight: '22px' }} />
            <TextElement>.</TextElement>
          </ComplexText>
        )}
        <Footer>
          <Link onClick={this.navigateToGuide} text="REQUEST SMH GUIDE" />
          <Button onClick={history.goBack} text="DONE" />
        </Footer>
      </Wrapper>
    );
  }

  componentDidMount(): void {
    const {
      location: {
        state: { account }
      }
    } = this.props;
    clipboard.writeText(`0x${getAddress(account.publicKey)}`);
  }

  componentWillUnmount() {
    clearTimeout(this.copiedTimeout);
  }

  copyPublicAddress = () => {
    const {
      location: {
        state: { account }
      }
    } = this.props;
    clipboard.writeText(`0x${getAddress(account.publicKey)}`);
    this.setState({ isCopied: true });
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 3000);
  };

  navigateToNodeSetup = () => {
    const { history } = this.props;
    history.push('/main/node-setup');
  };

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/get_coin');

  navigateToTap = () => shell.openExternal('https://discord.gg/ASpy52C');
}

export default RequestCoins;
