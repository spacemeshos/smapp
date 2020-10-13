// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Modal, Loader } from '/basicComponents';
import { smColors, ipcConsts } from '/vars';
import styled from 'styled-components';
import { notificationsService } from '/infra/notificationsService';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

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
      <Modal>
        <InnerWrapper>
          <Loader size={Loader.sizes.BIG} />
          <Text>Shutting down, please wait...</Text>
        </InnerWrapper>
      </Modal>
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
