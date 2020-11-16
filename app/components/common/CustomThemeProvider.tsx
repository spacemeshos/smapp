import React, { FunctionComponent, useEffect, useState } from 'react';
import { ThemeProvider, withTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { eventsService } from '../../infra/eventsService';
import { switchTheme } from '../../redux/ui/actions';
import { RootState } from '../../types';

type Props = {
  children: any;
};

type ThemeProps = {
  theme: { isDarkMode: boolean };
};

const CustomThemeProvider: FunctionComponent<Props & ThemeProps> = ({ children }: Props) => {
  const [useDarkColor, setUseDarkColor] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOSThemeColor = async () => {
      // TODO find better solution to determine theme color
      const result = await eventsService.getOsThemeColor();
      setUseDarkColor(result);
    };

    fetchOSThemeColor();
  }, []);

  useEffect(() => {
    dispatch(switchTheme());
  }, [dispatch, useDarkColor]);

  return <ThemeProvider theme={{ isDarkMode }}>{children}</ThemeProvider>;
};

export default withTheme(CustomThemeProvider);
