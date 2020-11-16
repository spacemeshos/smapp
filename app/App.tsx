import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Store } from './redux/store';
import { logout } from './redux/auth/actions';
import routes from './routes';
import GlobalStyle from './globalStyle';
import { OnQuitModal, CustomThemeProvider } from './components/common';

type Props = {
  store: Store;
};

const App = ({ store }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);
  return (
    <>
      <Provider store={store}>
        <CustomThemeProvider>
          <GlobalStyle />
          <Router>
            <Switch>
              {routes.app.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/pre" />
            </Switch>
          </Router>
          <OnQuitModal />
        </CustomThemeProvider>
      </Provider>
    </>
  );
};

export default hot(App);
