import React from 'react';
import { connect } from 'react-redux';
import { AppTopNavigation } from '/navigators';
import { navigationService } from '/infra/navigation';

type Props = {};

class App extends React.Component<Props> {
  render() {
    return (
        <AppTopNavigation
            ref={(navigatorRef) => {
              navigationService.setTopLevelNavigator(navigatorRef);
            }}
        />
    );
  }
}

export default App;
