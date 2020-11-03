// @flow
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { eventsService } from '/infra/eventsService';
import { loader, loaderWhite } from '/assets/images';
import styled from 'styled-components';

const AnimatedIcon = styled.img`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

const Dashboard = () => {
  const isDarkModeOn = true;

  useEffect(() => {
    eventsService.openBrowserView();
    return () => eventsService.destroyBrowserView();
  }, []);

  return <AnimatedIcon size={250} src={isDarkModeOn ? loaderWhite : loader} alt="Loading" />;
};

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

export default connect(mapStateToProps)(Dashboard);
