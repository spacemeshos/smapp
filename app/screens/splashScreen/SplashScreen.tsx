import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getNodeStatus } from '../../redux/node/actions';
import { Loader } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { RootState } from '../../types';

const SplashScreen = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: any = null;
    const startNode = async () => {
      const status = await dispatch(getNodeStatus());
      // @ts-ignore
      if (status && !status?.noConnection) {
        history.push('/auth');
      } else {
        await eventsService.startNode();
        const isReady = await eventsService.isServiceReady();
        if (isReady) {
          history.push('/auth');
        } else {
          interval = setInterval(async () => {
            const isReady = await eventsService.isServiceReady();
            if (isReady) {
              clearInterval(interval);
              history.push('/auth');
            }
          }, 200);
        }
      }
    };
    startNode();
    return () => {
      clearInterval(interval);
    };
  });

  return <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />;
};

export default SplashScreen;
