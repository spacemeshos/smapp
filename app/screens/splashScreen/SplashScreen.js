import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getNodeStatus } from '/redux/node/actions';
import { Loader } from '/basicComponents';
import { eventsService } from '/infra/eventsService';
import { Modal } from '/components/common';
import type { RouterHistory } from 'react-router-dom';
import type { Action } from '/types';

const Message = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 30px 0 150px 0;
`;

type Props = {
  getNodeStatus: Action,
  history: RouterHistory,
  isDarkModeOn: boolean
};

class SplashScreen extends PureComponent<Props> {
  interval: IntervalID;

  startTime: number;

  constructor(props) {
    super(props);
    this.state = {
      showErrorModal: false
    };
  }

  render() {
    const { isDarkModeOn } = this.props;
    const { showErrorModal } = this.state;
    return showErrorModal ? (
      <Modal header="Error" subHeader="Something`s wrong here..." isDarkModeOn={isDarkModeOn}>
        <Message>Restart app please...</Message>
      </Modal>
    ) : (
      <Loader size={Loader.sizes.BIG} isDarkModeOn={isDarkModeOn} />
    );
  }

  async componentDidMount() {
    const { getNodeStatus, history } = this.props;
    const status = await getNodeStatus();

    if (status && !status.noConnection) {
      history.push('/auth');
    } else {
      await eventsService.startNode();
      const isReady = await eventsService.isServiceReady();
      if (isReady) {
        history.push('/auth');
      } else {
        this.startTime = new Date().getTime();
        this.interval = setInterval(async () => {
          const isReady = await eventsService.isServiceReady();
          if (isReady) {
            clearInterval(this.interval);
            history.push('/auth');
          } else {
            const endTime = this.startTime + 180000 > new Date().getTime();
            !endTime && this.setState({ showErrorModal: true });
          }
        }, 200);
      }
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }
}

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  getNodeStatus
};

SplashScreen = connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

export default SplashScreen;
