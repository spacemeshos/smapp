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
      setTimeout(() => history.push('/auth'), 10000);
    }
  }
}

const mapDispatchToProps = {
  getNodeStatus
};

SplashScreen = connect(null, mapDispatchToProps)(SplashScreen);

export default SplashScreen;
