import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getNodeStatus } from '/redux/node/actions';
import { Loader } from '/basicComponents';
import { eventsService } from '/infra/eventsService';
import type { RouterHistory } from 'react-router-dom';
import type { Action } from '/types';

type Props = {
  getNodeStatus: Action,
  history: RouterHistory
};

class SplashScreen extends PureComponent<Props> {
  interval: IntervalID;

  render() {
    return <Loader size={Loader.sizes.BIG} />;
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
        this.interval = setInterval(async () => {
          const isReady = await eventsService.isServiceReady();
          if (isReady) {
            clearInterval(this.interval);
            history.push('/auth');
          }
        }, 200);
      }
    }
  }

  componentWillUnmount() {
    this.interval && clearInterval(this.interval);
  }
}

const mapDispatchToProps = {
  getNodeStatus
};

SplashScreen = connect(null, mapDispatchToProps)(SplashScreen);

export default SplashScreen;
