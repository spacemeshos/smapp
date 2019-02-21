// @flow
import React, { Component } from 'react';
import SideMenu from './baseComponents/SideMenu/SideMenu';
import StoryBook from './StoryBook';
import type { SideMenuEntry, LoadingEntry } from './baseComponents/SideMenu/SideMenu';

type WalletRootProps = {};
type WalletRootState = {
  fullNodeLoading: boolean,
  message: string
};

export default class WalletRoot extends Component<WalletRootProps, WalletRootState> {
  props: WalletRootProps;

  state: WalletRootState = {
    fullNodeLoading: true,
    message: ''
  };

  render() {
    const { fullNodeLoading, message } = this.state;
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      mainContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        heighy: '100%'
      }
    };

    const loadingEntry: LoadingEntry = { id: 1, isLoading: fullNodeLoading };

    return (
      <div style={styles.container}>
        <SideMenu onPress={this.handleSideMenuPress} loadingEntry={loadingEntry} />
        <div style={styles.mainContent}>
          <StoryBook message={message} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        fullNodeLoading: false
      });
    }, 8000);
  }

  handleSideMenuPress = (selection: SideMenuEntry) => {
    this.setState({ message: `${selection.id}: ${selection.label}` });
  };
}
