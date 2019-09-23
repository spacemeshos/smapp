// @flow
import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
import { checkNodeConnection, getMiningStatus } from '/redux/node/actions';
import { nodeService } from '/infra/nodeService';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';
import { configureStore } from './redux/configureStore';
import { ErrorHandlerModal } from '/components/errorHandler';

const store: Store = configureStore();

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

type Props = {};

type State = {
  error: ?Error
};

class App extends React.Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  startNodeInterval: IntervalID;

  connectionAndMiningInterval: IntervalID;

  checkConnectionTimer: TimeoutID;

  state = {
    error: null
  };

  render() {
    const { error } = this.state;
    if (error) {
      return <ErrorHandlerModal componentStack={''} explanationText="Retry failed action or refresh page" error={error} onRefresh={nodeService.hardRefresh} />;
    }
    return (
      <>
        <GlobalStyle />
        <Provider store={store}>
          <Router>
            <Switch>
              {routes.app.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/auth" />
            </Switch>
          </Router>
        </Provider>
      </>
    );
  }

  async componentDidMount() {
    this.clearTimers();
    const isConnected = await store.dispatch(checkNodeConnection());
    if (!isConnected) {
      await this.localNodeFlow();
    } else {
      this.connectionAndMiningFlow();
    }
  }

  componentWillUnmount(): void {
    this.clearTimers();
    store.dispatch(logout());
  }

  clearTimers = () => {
    this.connectionAndMiningInterval && clearInterval(this.connectionAndMiningInterval);
    this.startNodeInterval && clearInterval(this.startNodeInterval);
    this.checkConnectionTimer && clearTimeout(this.checkConnectionTimer);
  };

  localNodeFlow = async () => {
    try {
      await this.startLocalNode();
      this.connectionAndMiningFlow();
    } catch {
      this.setState({
        error: new Error('Failed to start Spacemesh Node.')
      });
    }
  };

  startLocalNode = () => {
    const intervalTime = 5000; // ms
    let attemptsRemaining = 5;
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      this.startNodeInterval = setInterval(async () => {
        if (!attemptsRemaining) {
          reject();
        } else {
          const isConnectedProps = store.getState().node.isConnected;
          attemptsRemaining -= 1;
          if (!isConnectedProps) {
            try {
              await nodeService.startNode();
            } catch {
              // Ignoring this error since we still want to check connection if node is already running.
            }
            this.checkConnectionTimer = setTimeout(async () => {
              const isConnected = await store.dispatch(checkNodeConnection());
              clearInterval(this.startNodeInterval);
              isConnected && resolve();
            }, 1000);
          } else {
            clearInterval(this.startNodeInterval);
            resolve();
          }
        }
      }, intervalTime);
    });
  };

  connectionAndMiningFlow = async () => {
    const connectionAndMiningIntervalTime = 360000;
    await store.dispatch(getMiningStatus());
    this.connectionAndMiningInterval = setInterval(async () => {
      await store.dispatch(checkNodeConnection());
    }, connectionAndMiningIntervalTime);
  };
}

App = process.env.NODE_ENV === 'development' ? hot(module)(App) : App;

export default App;
