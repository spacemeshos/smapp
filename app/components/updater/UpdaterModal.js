// @flow
import React, { Component } from 'react';
import { CorneredWrapper, Button } from '/basicComponents';
import styled from 'styled-components';
import { smColors } from '/vars';
import { walletUpdateService } from '/infra/walletUpdateService';
import srcReg from '/assets/fonts/SourceCodePro-Regular.ttf';

const Wrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  src: url(${srcReg});
  font-family: SourceCodePro;
`;

const InnerWrapper = styled.div`
  padding: 25px;
  background-color: ${smColors.lightGray};
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.black};
  margin-top: 20px;
`;

const Header = styled(Text)`
  font-size: 20px;
  margin-top: 0;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasSingleButton }) => (hasSingleButton ? 'center' : 'space-between')};
  margin-top: 30px;
`;

type Props = {
  onCloseModal: ({ isUpdateDismissed: boolean }) => void
};

type State = {
  isDownloadReady: boolean,
  downloadStatus: string,
  isLoading: boolean,
  canDismiss: boolean
};

class UpdaterModal extends Component<Props, State> {
  state = {
    isDownloadReady: false,
    downloadStatus: '',
    isLoading: false,
    canDismiss: true
  };

  render() {
    const { isDownloadReady, downloadStatus, isLoading, canDismiss } = this.state;
    return (
      <Wrapper>
        <CorneredWrapper>
          <InnerWrapper>
            <Header>Wallet Update Available</Header>
            {downloadStatus
              ? [<Text key="1">Please wait while download is in progress.</Text>, <Text key="2">{isDownloadReady ? 'Update downloaded.' : downloadStatus}</Text>]
              : [<Text key="1">An important App update is available.</Text>, <Text key="2">Would you like to download it now?</Text>]}
            <ButtonsWrapper>
              <Button
                onClick={isDownloadReady ? this.quitAppAndInstallUpdate : this.downloadUpdate}
                text={isDownloadReady ? 'RESTART AND INSTALL' : 'YES'}
                isDisabled={isLoading}
                width={isDownloadReady ? 150 : 95}
                style={{ marginRight: 20 }}
              />
              <Button onClick={this.handleDismissUpdate} text={isDownloadReady ? 'LATER' : 'NO'} isPrimary={false} isDisabled={!isDownloadReady && !canDismiss} />
            </ButtonsWrapper>
          </InnerWrapper>
        </CorneredWrapper>
      </Wrapper>
    );
  }

  handleDismissUpdate = () => {
    const { onCloseModal } = this.props;
    onCloseModal({ isUpdateDismissed: true });
  };

  downloadUpdate = () => {
    this.setState({ isLoading: true, canDismiss: false });
    walletUpdateService.downloadUpdate({
      onProgress: ({ receivedBytes, totalBytes }) => {
        this.setState({ downloadStatus: `${parseInt((receivedBytes / totalBytes) * 100)}% (${receivedBytes} / ${totalBytes} bytes) downloaded.` });
      },
      onDownloadUpdateCompleted: () => this.setState({ isDownloadReady: true, isLoading: false })
    });
  };

  quitAppAndInstallUpdate = async () => {
    const { onCloseModal } = this.props;
    walletUpdateService.quitAppAndInstallUpdate();
    onCloseModal({ isUpdateDismissed: false });
  };
}

export default UpdaterModal;
