// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { Modal } from '/components/common';
import { Loader } from '/basicComponents';
import { smColors, ipcConsts } from '/vars';
import styled from 'styled-components';
import { notificationsService } from '/infra/notificationsService';

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.orange};
  text-align: center;
  margin-bottom: 10px;
`;

type Props = {
  isDarkModeOn: boolean
};

const OnQuitModal = (props: Props) => {
  // eslint-disable-next-line react/prop-types
  const { isDarkModeOn } = props;
  const [isClosing, setIsClosing] = useState(false);
  ipcRenderer.on(ipcConsts.KEEP_RUNNING_IN_BACKGROUND, () => {
    setTimeout(() => {
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Smesher is running in the background.'
      });
    }, 1000);
  });
  ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
    setIsClosing(true);
  });

  return isClosing ? (
    <Modal width={600} height={600}>
      <Loader size={Loader.sizes.BIG} isDarkModeOn={isDarkModeOn} />
      <Text>Shutting down, please wait...</Text>
    </Modal>
  ) : null;
};

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

export default connect<any, any, _, _, _, _>(mapStateToProps)(OnQuitModal);
