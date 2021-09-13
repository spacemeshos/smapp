import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { eventsService } from '../../infra/eventsService';
import { loader, loaderWhite } from '../../assets/images';
import { RootState } from '../../types';

const AnimatedIcon = styled.img<{ size: number }>`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

const Dashboard = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    eventsService.openBrowserView();
    return eventsService.destroyBrowserView;
  }, [isDarkMode]);

  return <AnimatedIcon size={250} src={isDarkMode ? loaderWhite : loader} alt="Loading" />;
};

export default Dashboard;
