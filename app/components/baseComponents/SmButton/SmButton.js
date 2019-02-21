// @flow
import React from 'react';
import { smColors as Colors, smFonts as Fonts } from '../../../vars';

type SmButtonProps = {
  title: string,
  theme: 'green' | 'orange',
  disabled?: boolean,
  font?: 'font1' | 'font2' | 'font3' | 'font4',
  onPress: () => void
};

type SmButtonState = {
  hovered: boolean,
  clicked: boolean
};

const styles = {
  root: {
    borderRadius: 0,
    cursor: 'pointer'
  },
  disabled: {
    border: `1px solid ${Colors.borderGray}`,
    cursor: 'default'
  },
  buttonWrapper: {
    height: '100%',
    width: '100%'
  },
  button: {
    overflow: 'hidden',
    padding: 10,
    paddingTop: 6,
    userSelect: 'none'
  },
  buttonText: {
    textAlign: 'center'
  }
};

export default class SmButton extends React.Component<SmButtonProps, SmButtonState> {
  constructor(props: SmButtonProps) {
    super(props);
    this.state = {
      hovered: false,
      clicked: false
    };
  }

  render() {
    const { disabled, theme, title, onPress, font } = this.props;
    const { clicked, hovered } = this.state;
    const fontByTheme: string = theme === 'green' ? 'font3' : 'font4';

    const rootThemeStyle = () => {
      return {
        backgroundColor: theme === 'green' ? Colors.white : Colors.orange,
        border: `1px solid ${theme === 'green' ? Colors.borderGray : Colors.orange}`
      };
    };

    const hoveredThemeStyle = () => {
      return {
        backgroundColor: theme === 'green' ? `rgba(${Colors.greenRgb}, 0.1)` : `rgba(${Colors.orangeRgb}, 0.71)`
      };
    };

    const disabledThemeStyle = () => {
      return { backgroundColor: theme === 'green' ? Colors.white : Colors.borderGray };
    };

    const clickedThemeStyle = () => {
      return { backgroundColor: theme === 'green' ? Colors.white : Colors.darkOrange, border: `1px solid ${theme === 'green' ? Colors.green : Colors.orange}` };
    };

    const buttonTextThemeStyle = () => {
      return {
        color: theme === 'green' ? Colors.darkGreen : Colors.white,
        ...Fonts[font !== undefined ? font : fontByTheme]
      };
    };

    const disabledTextThemeStyle = () => {
      return disabled ? { color: theme === 'green' ? Colors.borderGray : Colors.white } : {};
    };

    const smButtonElem = () => (
      <div style={styles.button} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span style={{ ...styles.buttonText, ...buttonTextThemeStyle(), ...disabledTextThemeStyle() }}>{title}</span>
      </div>
    );

    const rootStyles = () => {
      if (disabled) {
        return { ...styles.disabled, ...disabledThemeStyle() };
      }
      if (clicked) {
        return clickedThemeStyle();
      }
      if (hovered) {
        return hoveredThemeStyle();
      }
      return {};
    };

    return (
      <div style={{ ...styles.root, ...rootThemeStyle(), ...rootStyles() }}>
        <div style={styles.buttonWrapper} onClick={disabled ? undefined : onPress} onMouseDown={this.handlePressIn} onMouseUp={this.handlePressOut}>
          {smButtonElem()}
        </div>
      </div>
    );
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handlePressIn = () => {
    this.setState({ clicked: true });
  };

  handlePressOut = () => {
    this.setState({ clicked: false });
  };
}
