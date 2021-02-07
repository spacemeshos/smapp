// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { CorneredWrapper, Loader } from '/basicComponents';
import { smColors, ipcConsts } from '/vars';
import styled from 'styled-components';
import { notificationsService } from '/infra/notificationsService';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

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
  width: 700px;
  height: 550px;
  padding: 25px;
  background-color: ${isDarkModeOn ? smColors.dMBlack1 : smColors.lightGray};
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  text-align: center;
  margin-bottom: 10px;
`;

type State = {
  isClosing: boolean
};

class OnQuitModal extends Component<{}, State> {
  state = {
    isClosing: false
  };

  render() {
    const { isClosing } = this.state;
    return isClosing ? (
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Loader size={Loader.sizes.BIG} />
            <Text>Shutting down, please wait...</Text>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
    ) : null;
  }

  componentDidMount() {
    ipcRenderer.on(ipcConsts.KEEP_RUNNING_IN_BACKGROUND, () => this.handleKeepInBackground());
    ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
      this.setState({ isClosing: true });
    });
  }

  handleKeepInBackground = () => {
    setTimeout(() => {
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Smesher is running in the background.'
      });
    }, 1000);
  };
}

export default OnQuitModal;
