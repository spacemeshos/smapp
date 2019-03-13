// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { SmButton, SmInput } from '/basicComponents';
import { welcomeBack } from '/assets/images';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 30px;
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const UpperPartHeader = styled.span`
  font-size: 24px;
  text-align: left;
  color: ${smColors.black};
`;

const SmallLink = styled.span`
  font-size: 14px;
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

type Props = {
  setCreationMode: Function,
  navigateToWallet: Function
};

type State = {
  password: string,
  hasError: false
};

class DecryptWalletCard extends Component<Props, State> {
  state = {
    password: '',
    hasError: false
  };

  render() {
    const { setCreationMode, navigateToWallet } = this.props;
    const { password, hasError } = this.state;
    return (
      <Wrapper>
        <UpperPart>
          <ImageWrapper>
            <Image src={welcomeBack} />
          </ImageWrapper>
          <UpperPartHeader>Enter PIN to access wallet</UpperPartHeader>
          <SmInput type="password" placeholder="Type PIN" hasError={hasError} onChange={this.handlePasswordTyping} hasDebounce />
        </UpperPart>
        <BottomPart>
          <SmButton text="Login" disabled={!password || hasError} theme="orange" onPress={() => navigateToWallet({ password })} style={{ marginTop: 20 }} />
          <LinksWrapper>
            <SmallLink onClick={setCreationMode}>Create a new wallet</SmallLink>
            <SmallLink onClick={setCreationMode}>Restore wallet</SmallLink>
          </LinksWrapper>
        </BottomPart>
      </Wrapper>
    );
  }

  handlePasswordTyping = ({ value }: { value: string }) => {
    this.setState({ password: value });
  };
}

export default DecryptWalletCard;
