// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { CorneredWrapper, Button } from '/basicComponents';
import { smColors, ipcConsts, nodeConsts } from '/vars';
import styled from 'styled-components';
import { notificationsService } from '/infra/notificationsService';
// import { nodeService } from '/infra/nodeService';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  z-index: 2;
`;

const InnerWrapper = styled.div`
  padding: 25px;
  background-color: ${smColors.lightGray};
  width: 700px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
`;

const Header = styled(Text)`
  margin-bottom: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 30px;
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
            <Header>Quit Spacemesh and stop the full node?</Header>
            <Text>Quitting Spacemesh and stopping the full node may cause you to lose mining awards.</Text>
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
    ipcRenderer.on(ipcConsts.REQUEST_CLOSE, this.handleQuitEvent);
  }

  componentDidUpdate(prevProps: Props) {
    const { miningStatus } = this.props;
    if (prevProps.miningStatus !== miningStatus) {
      ipcRenderer.removeAllListeners(ipcConsts.REQUEST_CLOSE);
      ipcRenderer.on(ipcConsts.REQUEST_CLOSE, this.handleQuitEvent);
    }
  }

  handleQuitEvent = () => {
    const { miningStatus } = this.props;
    const isMining = miningStatus === nodeConsts.IN_SETUP || miningStatus === nodeConsts.IS_MINING;
    isMining ? this.setState({ isVisible: true }) : this.handleQuit();
  };

  handleQuit = async () => {
    ipcRenderer.sendSync(ipcConsts.QUIT_NODE);
    ipcRenderer.send(ipcConsts.QUIT_APP);
  };

  handleKeepInBackground = () => {
    this.setState({ isVisible: false });
    ipcRenderer.send(ipcConsts.KEEP_RUNNING_IN_BACKGROUND);
    const timer = setTimeout(() => {
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Full node is running in the background.'
      });
      clearTimeout(timer);
    }, 2500);
  };
}

const mapStateToProps = (state) => ({
  miningStatus: state.node.miningStatus
});

QuitDialog = connect<any, any, _, _, _, _>(mapStateToProps)(QuitDialog);
export default QuitDialog;
