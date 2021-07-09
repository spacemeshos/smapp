import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';
import StyledApp from './StyledApp';
import './assets/fonts/SourceCodePro-Regular.ttf';
import './assets/fonts/SourceCodePro-Bold.ttf';
import { subscribeOnIpcEvents } from './infra/eventsService/eventsService';

const App = () => {
  useEffect(() => subscribeOnIpcEvents(store), []);

  return (
    <Provider store={store}>
      <StyledApp />
    </Provider>
  );
};

export default App;
