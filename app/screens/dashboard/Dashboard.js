// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import styled from 'styled-components';
import { eventsService } from '/infra/eventsService';
import { loader, loaderWhite } from '/assets/images';
import ipcConsts from '/vars/ipcConsts';

const AnimatedIcon = styled.img`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

type Props = {
  isDarkModeOn: boolean
};

const Dashboard = (props: Props) => {
  const { isDarkModeOn } = props;

  useEffect(() => {
    ipcRenderer.send(ipcConsts.SEND_THEME_COLOR, { isDarkModeOn });
  }, [isDarkModeOn]);

  useEffect(() => {
    eventsService.openBrowserView(isDarkModeOn);
    return () => eventsService.destroyBrowserView();
  }, []);

  return <AnimatedIcon size={250} src={isDarkModeOn ? loaderWhite : loader} alt="Loading" />;
};

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

export default connect(mapStateToProps)(Dashboard);
