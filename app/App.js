// @flow
import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
// import { setUpdateDownloading } from '/redux/wallet/actions';
// import { walletUpdateService } from '/infra/walletUpdateService';
import { nodeService } from '/infra/nodeService';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';
import { configureStore } from './redux/configureStore';
import { ErrorHandlerModal } from '/components/errorHandler';
import { OnQuitModal } from '/components/common';
import { UpdaterModal } from '/components/updater';

const store: Store = configureStore();

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

type Props = {};

type State = {
  error: ?Object,
  isUpdateDownloaded: boolean
};

class App extends React.Component<Props, State> {
  // eslint-disable-next-line react/sort-comp
  updateCheckInterval: IntervalID;

  state = {
    error: null,
    isUpdateDownloaded: false
  };

  render() {
    const { error, isUpdateDownloaded } = this.state;
    return (
      <>
        <GlobalStyle />
        {error ? <ErrorHandlerModal componentStack={''} explanationText="Wallet update check has failed" error={error} onRefresh={nodeService.hardRefresh} /> : null}
        {isUpdateDownloaded ? <UpdaterModal onCloseModal={this.closeUpdateModal} /> : null}
        <Provider store={store}>
          <Router>
            <Switch>
              {routes.app.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/pre" />
            </Switch>
          </Router>
          <OnQuitModal />
        </Provider>
      </>
    );
  }

  // TODO: auto update is temporary disabled
  // async componentDidMount() {
  //   try {
  //     walletUpdateService.listenToUpdaterError({
  //       onUpdaterError: () => {
  //         throw new Error('Wallet Updater Error.');
  //       }
  //     });
  //     walletUpdateService.listenToDownloadUpdate({
  //       onDownloadUpdateCompleted: () => {
  //         store.dispatch(setUpdateDownloading({ isUpdateDownloading: false }));
  //         this.setState({ isUpdateDownloaded: true });
  //       },
  //       onDownloadProgress: () => store.dispatch(setUpdateDownloading({ isUpdateDownloading: true }))
  //     });
  //     walletUpdateService.checkForWalletUpdate();
  //     this.updateCheckInterval = setInterval(async () => {
  //       walletUpdateService.checkForWalletUpdate();
  //     }, 86400000);
  //   } catch (error) {
  //     this.setState({
  //       error: new Error('Wallet update check has failed.')
  //     });
  //   }
  // }

  componentWillUnmount(): void {
    this.updateCheckInterval && clearInterval(this.updateCheckInterval);
    store.dispatch(logout());
  }

  closeUpdateModal = () => this.setState({ isUpdateDownloaded: false });
}

App = process.env.NODE_ENV === 'development' ? hot(module)(App) : App;

export default App;
