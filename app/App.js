// @flow
import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
import { checkNodeConnection } from '/redux/node/actions';
import { nodeService } from '/infra/nodeService';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';
import { httpService } from '/infra/httpService';
import { configureStore } from './redux/configureStore';
import { ErrorHandlerModal } from '/components/errorHandler';

const store: Store = configureStore();

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

type Props = {};

type State = {
  isConnectedState: boolean[],
  error: ?Error
};

class App extends React.Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  startNodeInterval: IntervalID;

  healthCheckInterval: IntervalID;

  checkConnectionTimer: TimeoutID;

  unsubscribe: () => void;

  state = {
    isConnectedState: [false, false],
    error: null
  };

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <ErrorHandlerModal
          componentStack={''}
          explanationText="Retry failed action or refresh page"
          error={error}
          onRetry={() => this.setState({ error: null }, this.localNodeFlow)}
          onRefresh={() => this.setState({ error: null })}
        />
      );
    }
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  async componentDidMount() {
    this.subscribeToStore();
    const isConnected = await this.checkConnectionAsync();
    this.clearTimers();
    if (!isConnected) {
      await this.localNodeFlow();
    } else {
      this.healthCheckFlow();
    }
  }

  componentWillUnmount(): void {
    this.clearTimers();
    this.unsubscribe();
    store.dispatch(logout());
  }

  subscribeToStore = () => {
    this.unsubscribe = store.subscribe(() => {
      const { isConnectedState } = this.state;
      const newIsConnectedState = [store.getState().node.isConnected, isConnectedState[0]];
      const [isConnected, isConnectedPrev] = newIsConnectedState;
      const hasDisconnectError = isConnectedPrev && !isConnected;
      hasDisconnectError && this.clearTimers();
      this.setState({ isConnectedState: newIsConnectedState, error: hasDisconnectError ? new Error('Disconnected from Spacemesh Node.') : null });
    });
  };

  clearTimers = () => {
    this.healthCheckInterval && clearInterval(this.healthCheckInterval);
    this.startNodeInterval && clearInterval(this.startNodeInterval);
    this.checkConnectionTimer && clearTimeout(this.checkConnectionTimer);
  };

  localNodeFlow = async () => {
    try {
      await this.startLocalNode();
      this.healthCheckFlow();
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
            const isConnected = await this.checkConnectionAsync();
            isConnected && resolve();
          } else {
            resolve();
          }
        }
      }, intervalTime);
    });
  };

  healthCheckFlow = () => {
    const healthCheckInterval = 50000;
    store.dispatch(checkNodeConnection());
    this.healthCheckInterval = setInterval(() => {
      store.dispatch(checkNodeConnection());
    }, healthCheckInterval);
  };

  checkConnectionAsync = async () => {
    try {
      await httpService.checkNodeConnection();
      return true;
    } catch (err) {
      return false;
    }
  };
}

App = process.env.NODE_ENV === 'development' ? hot(module)(App) : App;

export default App;
