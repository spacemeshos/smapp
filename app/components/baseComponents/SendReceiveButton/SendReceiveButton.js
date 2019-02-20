// @flow
import * as React from 'react';
import Colors from '../../../vars/colors';
import Fonts from '../../../vars/fonts';
import * as sendImageSource from './assets/send@2x.png';
import * as receiveImageSource from './assets/receive@2x.png';
import * as sendImageSourceDisabled from './assets/send@2x_disabled.png';
import * as receiveImageSourceDisabled from './assets/receive@2x_disabled.png';

type SendReceiveButtonProps = {
  title: 'Send coins' | 'Receive coins',
  disabled?: boolean,
  onPress: () => void
};

type SendReceiveButtonState = {
  hovered: boolean
};

export default class SendReceiveButton extends React.Component<SendReceiveButtonProps, SendReceiveButtonState> {
  constructor(props: SendReceiveButtonProps) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  render() {
    const { disabled, onPress, title } = this.props;
    const { hovered } = this.state;
    const styles = {
      root: {
        height: 90,
        width: 244,
        border: `1px solid ${Colors.green}`,
        borderRadius: 2,
        cursor: 'pointer'
      },
      buttonWrapper: {
        height: 'inherit',
        width: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      },
      button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        userSelect: 'none'
      },
      buttonText: {
        ...Fonts.font2,
        color: Colors.black
      },
      buttonTextContainer: {
        margin: 10
      },
      hovered: {
        backgroundColor: `rgba(${Colors.greenRgb}, 0.1)`
      },
      disabled: {
        border: `1px solid ${Colors.borderGray}`,
        cursor: 'default'
      },
      disabledText: {
        color: Colors.borderGray
      }
    };

    const imageStyle = { height: 40, width: 40 };

    const getImageSource = () => {
      if (disabled) {
        return title === 'Send coins' ? sendImageSourceDisabled : receiveImageSourceDisabled;
      } else {
        return title === 'Send coins' ? sendImageSource : receiveImageSource;
      }
    };

    const sendReceiveButtonDisabledStyle = () => {
      if (disabled) {
        return styles.disabledText;
      }
      return {};
    };

    const sendReceiveButtonElem = () => (
      <div style={styles.button}>
        <img src={getImageSource()} style={imageStyle} alt="Missing icon" />
        <div style={styles.buttonTextContainer}>
          <span style={{ ...styles.buttonText, ...sendReceiveButtonDisabledStyle() }}>{title}</span>
        </div>
      </div>
    );

    const rootStyles = () => {
      if (disabled) {
        return styles.disabled;
      }
      if (hovered) {
        return styles.hovered;
      }
      return {};
    };

    return (
      <div style={{ ...styles.root, ...rootStyles() }}>
        <div style={styles.buttonWrapper} onClick={disabled ? undefined : onPress}>
          <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
            {sendReceiveButtonElem()}
          </div>
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
}
