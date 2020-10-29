// @flow
import React, { useEffect, useState } from 'react';
import { eventsService } from '/infra/eventsService';
import { connect } from 'react-redux';
import { ThemeProvider, withTheme } from 'styled-components';
import { switchTheme } from '/redux/ui/actions';
import type { Action } from '/types';

type Props = {
  isDarkModeOn: boolean,
  children: Node,
  switchTheme: Action
};

const CustomThemeProvider = (props: Props) => {
  const { isDarkModeOn, children, switchTheme } = props;

  const [useDarkColor, setUseDarkColor] = useState(false);

  useEffect(() => {
    const fetchOSThemeColor = async () => {
      const result = await eventsService.getOsThemeColor();
      setUseDarkColor(result);
    };

    fetchOSThemeColor().catch();
  }, []);

  useEffect(() => {
    useDarkColor && switchTheme();
  }, [useDarkColor]);

  return <ThemeProvider theme={{ isDarkModeOn }}>{children}</ThemeProvider>;
};

const mapStateToProps = (state) => ({
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  switchTheme
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CustomThemeProvider));
