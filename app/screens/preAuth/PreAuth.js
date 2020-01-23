import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { checkNodeConnection } from '/redux/node/actions';
import { CorneredContainer } from '/components/common';
import { Button, Input, ErrorPopup } from '/basicComponents';
import { nodeService } from '/infra/nodeService';
import { smColors } from '/vars';
import { smallInnerSideBar, chevronRightBlack } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';
import type { Action } from '/types';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 30px 25px;
`;

const Indicator = styled.div`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${({ hasError }) => (hasError ? smColors.orange : smColors.black)};
`;

const SmallSideBar = styled.img`
  position: absolute;
  bottom: 0;
  right: -30px;
  width: 15px;
  height: 50px;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Chevron = styled.img`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const ErrorSection = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  margin-left: 10px;
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding-top: 45px;
`;

type Props = {
  checkNodeConnection: Action,
  history: RouterHistory
};

type State = {
  password: string,
  hasError: boolean
};

class PreAuth extends Component<Props, State> {
  state = {
    port: '',
    hasError: false
  };

  render() {
    const { port, hasError } = this.state;
    return (
      <Wrapper>
        <InnerWrapper>
          <CorneredContainer width={520} height={310} header="Node Init" subHeader="Enter forwarded port number.">
            <Indicator hasError={hasError} />
            <SmallSideBar src={smallInnerSideBar} />
            <InputSection>
              <Chevron src={chevronRightBlack} />
              <Input type="text" placeholder="ENTER PORT" value={port} onEnterPress={this.addPort} onChange={this.handlePortTyping} style={{ flex: 1 }} />
              <ErrorSection>{hasError && <ErrorPopup onClick={() => this.setState({ port: '', hasError: false })} text="Port should be digits only." />}</ErrorSection>
            </InputSection>
            <BottomPart>
              <Button text="ENTER" isDisabled={!port.trim() || !!hasError} onClick={this.addPort} style={{ marginTop: 'auto' }} />
            </BottomPart>
          </CorneredContainer>
        </InnerWrapper>
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { checkNodeConnection, history } = this.props;
    const isConnected = await checkNodeConnection();
    if (isConnected) {
      history.push('/auth');
    }
  }

  handlePortTyping = ({ value }: { value: string }) => {
    this.setState({ port: value, hasError: false });
  };

  addPort = () => {
    const { history } = this.props;
    const { port } = this.state;
    const parsedPort = parseInt(port);
    if (!parsedPort) {
      this.setState({ hasError: true });
    } else {
      // pull params
      nodeService.tmpRunNodeFunc({ port: parsedPort });
      history.push('/auth');
    }
  };
}

const mapDispatchToProps = {
  checkNodeConnection
};

PreAuth = connect(null, mapDispatchToProps)(PreAuth);

export default PreAuth;
