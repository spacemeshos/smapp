// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { CorneredWrapper, Button } from '/basicComponents';
import { smColors, ipcConsts, nodeConsts } from '/vars';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${smColors.white};
  z-index: 2;
`;

const InnerWrapper = styled.div`
  padding: 25px;
  background-color: ${smColors.lightGray};
  width: 580px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  margin-top: 20px;
`;

const Header = styled(Text)`
  margin-top: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 30px;
`;

type Props = {
  miningStatus: number
};

type State = {
  isVisible: boolean
};

class QuitDialog extends Component<Props, State> {
  state = {
    isVisible: false
  };

  render() {
    const { isVisible } = this.state;
    return isVisible ? (
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Header>Quit Spacemesh and stop the miner?</Header>
            <Text>Quitting Spacemesh and stopping the miner may cause you to lose mining rewards.</Text>
            <ButtonsWrapper>
              <Button onClick={() => this.setState({ isVisible: false })} text="CANCEL" isPrimary={false} />
              <Button onClick={this.handleQuit} text="QUIT" isPrimary={false} />
              <Button onClick={this.handleKeepInBackground} text="KEEP RUNNING IN BACKGROUND" width={270} />
            </ButtonsWrapper>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
    ) : null;
  }

  componentDidMount() {
    ipcRenderer.on(ipcConsts.REQUEST_CLOSE, async () => {
      const { miningStatus } = this.props;
      const isMining = miningStatus === nodeConsts.IN_SETUP || miningStatus === nodeConsts.IS_MINING;
      isMining ? this.setState({ isVisible: true }) : this.handleQuit();
    });
  }

  handleQuit = () => ipcRenderer.send(ipcConsts.QUIT_APP);

  handleKeepInBackground = () => {
    this.setState({ isVisible: false });
    ipcRenderer.send(ipcConsts.KEEP_RUNNING_IN_BACKGROUND);
  };
}

const mapStateToProps = (state) => ({
  miningStatus: state.node.miningStatus
});

QuitDialog = connect<any, any, _, _, _, _>(mapStateToProps)(QuitDialog);

export default QuitDialog;
