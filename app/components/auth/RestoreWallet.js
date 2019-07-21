import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { readFileName } from '/redux/wallet/actions';
import { SmButton } from '/basicComponents';
import { menu2 } from '/assets/images';
import { smColors } from '/vars';
import type { Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 30px 30px 50px 30px;
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
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Image = styled.img`
  height: 140px;
`;

const ErrorMsg = styled.div`
  width: 100%;
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  color: ${smColors.red};
`;

type Props = {
  setUnlockMode: () => void,
  toggleRestoreWith12Words: () => void,
  readFileName: Action
};

type State = {
  errorMsg: ?string
};

class RestoreWallet extends Component<Props, State> {
  state = {
    errorMsg: null
  };

  render() {
    const { toggleRestoreWith12Words } = this.props;
    const { errorMsg } = this.state;
    return (
      <Wrapper>
        <UpperPart>
          <ImageWrapper>
            <Image src={menu2} />
          </ImageWrapper>
        </UpperPart>
        <BottomPart>
          <ErrorMsg>{errorMsg}</ErrorMsg>
          <SmButton text="Restore From File" theme="orange" onPress={this.openWalletFile} style={{ marginBottom: 20 }} />
          <SmButton text="Restore With 12 Words" theme="orange" onPress={toggleRestoreWith12Words} />
        </BottomPart>
      </Wrapper>
    );
  }

  openWalletFile = async () => {
    const { readFileName, setUnlockMode } = this.props;
    try {
      await readFileName();
      setUnlockMode();
    } catch {
      this.setState({ errorMsg: 'Unable to open file' });
    }
  };
}

const mapDispatchToProps = {
  readFileName
};

RestoreWallet = connect(
  null,
  mapDispatchToProps
)(RestoreWallet);

export default RestoreWallet;
