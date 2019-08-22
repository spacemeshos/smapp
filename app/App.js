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

  componentDidMount() {
    const { checkNodeConnection } = this.props;
    checkNodeConnection();
    const timer = setTimeout(async () => {
      const { isConnected } = this.props;
      if (!isConnected) {
        try {
          await this.startLocalNodeFlow();
          this.keepAliveFlow();
        } catch {
          this.setState(() => {
            this.clearTimers();
            throw createError('Failed to start Spacemesh Node.', this.startLocalNodeFlow);
          });
        }
      } else {
        this.keepAliveFlow();
      }
      clearTimeout(timer);
    });
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

  timers: any[] = [];

  clearTimers = () => this.timers.forEach((timer) => clearInterval(timer));

  startLocalNodeFlow = () => {
    const intervalTime = 5000; // ms
    let attemptsLimit = 5;
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      this.timers.push(
        setInterval(async () => {
          if (!attemptsLimit) {
            reject();
          } else {
            const { isConnected } = this.props;
            attemptsLimit -= 1;
            if (!isConnected) {
              try {
                await fileSystemService.startNode();
              } catch {
                // eslint-disable-next-line no-console
                console.error('Cannot run local node or node is already running.');
              }
              try {
                await this.checkConnectionAsync();
                resolve();
              } catch {
                // eslint-disable-next-line no-console
                console.error(`Failed to run Spacemesh node. ${attemptsLimit + 1} tr${!attemptsLimit ? 'y' : 'ies'} remaining`);
              }
            } else {
              resolve();
            }
          }
        }, intervalTime)
      );
    });
  };

  keepAliveFlow = () => {
    // eslint-disable-next-line no-console
    console.warn('KEEP ALIVE FLOW');
    const { checkNodeConnection } = this.props;
    const keepAliveInterval = 50000;
    checkNodeConnection();
    this.timers.push(
      setInterval(() => {
        checkNodeConnection();
      }, keepAliveInterval)
    );
  };

  checkConnectionAsync = () => {
    const { checkNodeConnection } = this.props;
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      checkNodeConnection();
      this.timers.push(
        setTimeout(() => {
          const { isConnected } = this.props;
          isConnected ? resolve(isConnected) : reject();
        })
      );
    });
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

App = ScreenErrorBoundary(App);
export default App;
