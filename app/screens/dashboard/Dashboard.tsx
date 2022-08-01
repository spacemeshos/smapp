import React, { useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { eventsService } from '../../infra/eventsService';

const AnimatedIcon = styled.img.attrs(({ theme: { icons: { loader } } }) => ({
  src: loader,
}))<{ size: number }>`
  display: block;
  height: ${({ size }) => `${size}px`};
  width: ${({ size }) => `${size}px`};
`;

const Dashboard = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    eventsService.updateBrowserViewTheme({ isDarkMode });
  }, [isDarkMode]);

  useEffect(() => {
    eventsService.openBrowserView();
    return eventsService.destroyBrowserView;
  }, [isDarkMode]);

  return <AnimatedIcon size={250} alt="Loading" />;
};

export default Dashboard;
