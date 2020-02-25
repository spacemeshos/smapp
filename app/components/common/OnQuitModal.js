// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { CorneredWrapper, Button } from '/basicComponents';
import { smColors, ipcConsts, nodeConsts } from '/vars';
import styled from 'styled-components';
import { notificationsService } from '/infra/notificationsService';

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
  margin-bottom: 10px;
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

class OnQuitModal extends Component<Props, State> {
  state = {
    isVisible: false
  };

  render() {
    const { isVisible } = this.state;
    return isVisible ? (
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Header>Quitting stops smeshing may cause loss of future due smeshing rewards.</Header>
            <Text>&bull; Click RUN IN BACKGROUND to close the App window and to keep smeshing in the background.</Text>
            <Text>&bull; Click QUIT to close the app and stop smeshing.</Text>
            <ButtonsWrapper>
              <Button onClick={() => this.setState({ isVisible: false })} text="CANCEL" isPrimary={false} />
              <Button onClick={this.handleQuit} text="QUIT" isPrimary={false} />
              <Button onClick={this.handleKeepInBackground} text="RUN IN BACKGROUND" width={270} />
            </ButtonsWrapper>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
    ) : null;
  }

  componentDidMount() {
    const { miningStatus } = this.props;
    ipcRenderer.on(ipcConsts.REQUEST_CLOSE, () => this.handleQuitEvent(miningStatus));
  }

  componentDidUpdate(prevProps: Props) {
    const { miningStatus } = this.props;
    if (prevProps.miningStatus !== miningStatus) {
      ipcRenderer.removeAllListeners(ipcConsts.REQUEST_CLOSE);
      ipcRenderer.on(ipcConsts.REQUEST_CLOSE, () => this.handleQuitEvent(miningStatus));
    }
  }

  handleQuitEvent = (miningStatus: number) => {
    [nodeConsts.IN_SETUP, nodeConsts.IS_MINING].includes(miningStatus) ? this.setState({ isVisible: true }) : this.handleQuit();
  };

  handleQuit = () => {
    ipcRenderer.sendSync(ipcConsts.KILL_NODE);
    ipcRenderer.send(ipcConsts.QUIT_APP);
  };

  handleKeepInBackground = () => {
    this.setState({ isVisible: false });
    ipcRenderer.send(ipcConsts.KEEP_RUNNING_IN_BACKGROUND);
    setTimeout(() => {
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Smesher is running in the background.'
      });
    }, 1000);
  };
}

const mapStateToProps = (state) => ({
  miningStatus: state.node.miningStatus
});

OnQuitModal = connect<any, any, _, _, _, _>(mapStateToProps)(OnQuitModal);
export default OnQuitModal;
