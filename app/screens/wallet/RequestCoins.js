// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Button } from '/basicComponents';
import { getAbbreviatedText } from '/infra/utils';
import { copyToClipboard } from '/assets/images';
import { smColors } from '/vars';
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
  location: { state: { account: Account } },
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
        state: { account }
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
          <Text>Request SMH by sharing this address:</Text>
          <AddressWrapper onClick={this.copyPublicAddress}>
            <AddressText>{getAbbreviatedText(account.publicKey)}</AddressText>
            <CopyIcon src={copyToClipboard} />
            {isCopied && <CopiedText>Address copied!</CopiedText>}
          </AddressWrapper>
        </SubHeader>
        <Text>* This address is public and safe to share</Text>
        <Text>* Send this address to anyone you want to receive a SMH from</Text>
        <Text>* Copy + paste to share via email or a text messaging session</Text>
        <ComplexText>
          <Text>* You can mine SMH by setting up the Smesher&nbsp;</Text>
          <Link onClick={this.navigateToNodeSetup} text="Setup now" style={{ fontSize: 16, lineHeight: '22px' }} />
        </ComplexText>
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
    clipboard.writeText(`0x${account.publicKey}`);
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
    clipboard.writeText(`0x${account.publicKey}`);
    this.setState({ isCopied: true });
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 3000);
  };

  navigateToNodeSetup = () => {
    const { history } = this.props;
    history.push('/main/node-setup');
  };

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/get_coin');
}

export default RequestCoins;
