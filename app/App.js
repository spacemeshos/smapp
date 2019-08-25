// @flow
import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { Provider, connect } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
import { checkNodeConnection } from '/redux/node/actions';
import { fileSystemService } from '/infra/fileSystemService';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store, Action } from '/types';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { createError } from '/infra/utils';
import { httpService } from '/infra/httpService';

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

type Props = {
  store: Store,
  checkNodeConnection: Action,
  isConnected: boolean
};

class App extends React.Component<Props> {
  // eslint-disable-next-line react/sort-comp
  startNodeInterval;

  keepAliveInterval;

  checkConnectionTimer;

  render() {
    const { store } = this.props;
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
    const isConnected = await this.checkConnectionAsync();
    this.clearTimers();
    if (!isConnected) {
      try {
        await this.startLocalNodeFlow();
        this.keepAliveFlow();
      } catch {
        this.setState(() => {
          throw createError('Failed to start Spacemesh Node.', this.startLocalNodeFlow);
        });
      }
    } else {
      this.keepAliveFlow();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isConnected } = this.props;
    if (prevProps.isConnected && !isConnected) {
      this.clearTimers();
      throw createError('Disconnected from Spacemesh Node.', this.startLocalNodeFlow);
    }
  }

  componentWillUnmount(): void {
    const { store } = this.props;
    this.clearTimers();
    store.dispatch(logout());
  }

  clearTimers = () => {
    this.keepAliveInterval && clearInterval(this.keepAliveInterval);
    this.startNodeInterval && clearInterval(this.startNodeInterval);
    this.checkConnectionTimer && clearTimeout(this.checkConnectionTimer);
  };

  startLocalNodeFlow = () => {
    const intervalTime = 5000; // ms
    let attemptsRemaining = 5;
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      this.startNodeInterval = setInterval(async () => {
        if (!attemptsRemaining) {
          reject();
        } else {
          const { isConnected: isConnectedProps } = this.props;
          attemptsRemaining -= 1;
          if (!isConnectedProps) {
            try {
              await fileSystemService.startNode();
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

  keepAliveFlow = () => {
    const { checkNodeConnection } = this.props;
    const keepAliveInterval = 50000;
    checkNodeConnection();
    this.keepAliveInterval = setInterval(() => {
      checkNodeConnection();
    }, keepAliveInterval);
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

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected
});

const mapDispatchToProps = {
  checkNodeConnection,
  logout
};

App = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(App);

App = ScreenErrorBoundary(App, true);
export default App;
