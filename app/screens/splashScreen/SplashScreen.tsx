import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { getNodeStatus } from '../../redux/node/actions';
import { Modal } from '../../components/common';
import { Loader } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { RootState } from '../../types';

const Message = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 30px 0 150px 0;
`;

const SplashScreen = ({ history }: RouteComponentProps) => {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: number;
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
          const startTime = new Date().getTime();
          interval = setInterval(async () => {
            const isReady = await eventsService.isServiceReady();
            if (isReady) {
              clearInterval(interval);
              history.push('/auth');
            } else {
              const endTime = startTime + 180000 > new Date().getTime();
              !endTime && setShowErrorModal(true);
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

  return showErrorModal ? (
    <Modal header="Error" subHeader="Something`s wrong here...">
      <Message>Restart app please...</Message>
    </Modal>
  ) : (
    <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
  );
};

export default SplashScreen;
