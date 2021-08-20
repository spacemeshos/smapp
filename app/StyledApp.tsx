import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import routes from './routes';
import GlobalStyle from './globalStyle';
import { RootState } from './types';
import { setOsTheme } from './redux/ui/actions';
import ErrorBoundary from './ErrorBoundary';
import CloseAppModal from './components/common/CloseAppModal';

const StyledApp = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const isClosingApp = useSelector((state: RootState) => state.ui.isClosingApp);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOsTheme());
  }, [dispatch]);

  return (
    <ThemeProvider theme={{ isDarkMode }}>
      <GlobalStyle />
      <ErrorBoundary>
        {isClosingApp && <CloseAppModal isDarkMode={isDarkMode} />}
        <Router>
          <Switch>
            {routes.app.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/auth" />
          </Switch>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default StyledApp;
