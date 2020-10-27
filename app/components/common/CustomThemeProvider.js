// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import { connect } from 'react-redux';
import { ThemeProvider, withTheme } from 'styled-components';
import { switchTheme } from '/redux/ui/actions';
import type { Action } from '/types';

type Props = {
  isDarkModeOn: boolean,
  children: Node,
  switchTheme: Action
};

class CustomThemeProvider extends Component<Props> {
  render() {
    const { isDarkModeOn, children } = this.props;

    return <ThemeProvider theme={{ isDarkModeOn }}>{children}</ThemeProvider>;
  }

  componentDidMount() {
    const { switchTheme } = this.props;
    // Set dark theme if OS use it
    remote.nativeTheme.shouldUseDarkColors && switchTheme();
  }
}

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  switchTheme
};

CustomThemeProvider = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(withTheme(CustomThemeProvider));

export default CustomThemeProvider;
