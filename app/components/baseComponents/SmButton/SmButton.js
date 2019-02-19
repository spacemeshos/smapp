// @flow
import * as React from 'react';
import Colors from '../../../vars/colors';
import Fonts from '../../../vars/fonts';

type SmButtonProps = {
  title: string,
  theme: 'green' | 'orange',
  disabled?: boolean,
  widthLimit?: number | string,
  font?: 'font1' | 'font2' | 'font3' | 'font4',
  onPress: (e: any) => void
};

type SmButtonState = {
  hovered: boolean,
  clicked: boolean
};

export default class SmButton extends React.Component<
  SmButtonProps,
  SmButtonState
> {
  constructor(props: SmButtonProps) {
    super(props);
    this.state = {
      hovered: false,
      clicked: false
    };
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

  render() {
    const { disabled, theme, title, onPress, font } = this.props;
    const { clicked, hovered } = this.state;
    const styles = {
      root: {
        backgroundColor: theme === 'green' ? Colors.white : Colors.orange,
        border: `1px solid ${
          theme === 'green' ? Colors.borderGray : Colors.orange
        }`,
        borderRadius: 0,
        cursor: 'pointer'
      },
      hovered: {
        backgroundColor:
          theme === 'green'
            ? `rgba(${Colors.greenRgb}, 0.1)`
            : `rgba(${Colors.orangeRgb}, 0.71)`
      },
      disabled: {
        backgroundColor: theme === 'green' ? Colors.white : Colors.borderGray,
        border: `1px solid ${Colors.borderGray}`,
        cursor: 'default'
      },
      clicked: {
        backgroundColor: theme === 'green' ? Colors.white : Colors.darkOrange,
        border: `1px solid ${theme === 'green' ? Colors.green : Colors.orange}`
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
        color: theme === 'green' ? Colors.darkGreen : Colors.white,
        textAlign: 'center',
        ...Fonts[font ? font : theme === 'green' ? 'font3' : 'font4']
      },
      disabledText: {
        color: this.props.theme === 'green' ? Colors.borderGray : Colors.white
      }
    };

    const smButtonStyle = () => {
      if (disabled) {
        return styles.disabledText;
      }
      return {};
    };

    const smButtonElem = () => (
      <div
        style={styles.button}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <span style={{ ...styles.buttonText, ...smButtonStyle() }}>
          {title}
        </span>
      </div>
    );

    const rootStyles = () => {
      if (disabled) {
        return styles.disabled;
      }
      if (clicked) {
        return styles.clicked;
      }
      if (hovered) {
        return styles.hovered;
      }
      return {};
    };

    return (
      <div style={{ ...styles.root, ...rootStyles() }}>
        <div
          style={styles.buttonWrapper}
          onClick={disabled? undefined: onPress}
          onMouseDown={this.handlePressIn}
          onMouseUp={this.handlePressOut}
        >
          {smButtonElem()}
        </div>
      </div>
    );
  }
}
