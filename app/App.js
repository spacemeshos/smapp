// @flow
import { hot, setConfig } from 'react-hot-loader';
import { ipcRenderer } from 'electron';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
import { checkNodeConnection, getMiningStatus } from '/redux/node/actions';
import { setUpdateDownloading } from '/redux/wallet/actions';
import { walletUpdateService } from '/infra/walletUpdateService';
import { nodeService } from '/infra/nodeService';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';
import { configureStore } from './redux/configureStore';
import { ErrorHandlerModal } from '/components/errorHandler';
import { UpdaterModal } from '/components/updater';
import { ipcConsts } from '/vars';

const HEALTH_CHECK_INTERVAL = 360000;

const store: Store = configureStore();

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

type Props = {};

type State = {
  error: ?Error,
  isUpdateDownloaded: boolean
};

class App extends React.Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  startNodeInterval: IntervalID;

  healthCheckInterval: IntervalID;

  updateCheckInterval: IntervalID;

  checkConnectionTimer: TimeoutID;

  state = {
    error: null,
    isUpdateDownloaded: false
  };

  render() {
    const { error, isUpdateDownloaded } = this.state;

    if (error) {
      return <ErrorHandlerModal componentStack={''} explanationText="Retry failed action or refresh page" error={error} onRefresh={nodeService.hardRefresh} />;
    }

    return (
      <>
        <GlobalStyle />
        {isUpdateDownloaded ? <UpdaterModal onCloseModal={this.closeUpdateModal} /> : null}
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
    try {
      try {
        ipcRenderer.send(ipcConsts.CHECK_PROD_MODE);
        ipcRenderer.on(ipcConsts.IS_PROD_MODE, (isProductionMode) => {
          if (isProductionMode) {
            walletUpdateService.listenToUpdaterError({
              onUpdaterError: () => {
                throw new Error('Wallet Updater Error.');
              }
            });
            this.listenToDownloadUpdate();
            walletUpdateService.checkForWalletUpdate();
            this.updateCheckInterval = setInterval(async () => {
              walletUpdateService.checkForWalletUpdate();
            }, 86400000);
          }
        });
      } catch {
        throw new Error('Wallet updater has failed.');
      }
      const isConnected = await store.dispatch(checkNodeConnection());
      if (!isConnected) {
        try {
          await this.attemptToStartFullNode();
          this.healthCheckFlow();
        } catch {
          this.setState({
            error: new Error('Failed to start Spacemesh Node.')
          });
        }
      } else {
        this.healthCheckFlow();
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  componentWillUnmount(): void {
    this.healthCheckInterval && clearInterval(this.healthCheckInterval);
    this.startNodeInterval && clearInterval(this.startNodeInterval);
    this.updateCheckInterval && clearInterval(this.updateCheckInterval);
    this.checkConnectionTimer && clearTimeout(this.checkConnectionTimer);
    store.dispatch(logout());
  }

  attemptToStartFullNode = () => {
    const intervalTime = 5000; // ms
    let attemptsRemaining = 5;
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      this.startNodeInterval = setInterval(async () => {
        if (!attemptsRemaining) {
          clearInterval(this.startNodeInterval);
          reject();
        } else {
          const isConnectedToNode = store.getState().node.isConnected;
          attemptsRemaining -= 1;
          if (!isConnectedToNode) {
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

  listenToDownloadUpdate = () => {
    walletUpdateService.listenToDownloadUpdate({
      onDownloadUpdateCompleted: () => {
        store.dispatch(setUpdateDownloading({ isUpdateDownloading: false }));
        this.setState({ isUpdateDownloaded: true });
      },
      onDownloadProgress: () => store.dispatch(setUpdateDownloading({ isUpdateDownloading: true }))
    });
  };

  closeUpdateModal = () => this.setState({ isUpdateDownloaded: false });

  healthCheckFlow = async () => {
    await store.dispatch(getMiningStatus());
    this.healthCheckInterval = setInterval(async () => {
      await store.dispatch(checkNodeConnection());
    }, HEALTH_CHECK_INTERVAL);
  };
}

App = process.env.NODE_ENV === 'development' ? hot(module)(App) : App;

export default App;
