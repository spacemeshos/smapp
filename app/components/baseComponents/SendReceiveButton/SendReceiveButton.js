// @flow
import React from 'react';
import { smColors, smFonts } from '/vars';
import { sendImageSource, receiveImageSource, sendImageSourceDisabled, receiveImageSourceDisabled } from '/assets/images';

type SendReceiveButtonProps = {
  title: 'Send coins' | 'Receive coins',
  disabled?: boolean,
  onPress: () => void
};

type SendReceiveButtonState = {
  hovered: boolean
};

const styles = {
  root: {
    height: 90,
    width: 244,
    border: `1px solid ${smColors.green}`,
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
    ...smFonts.fontNormal16,
    color: smColors.black
  },
  buttonTextContainer: {
    margin: 10
  },
  hovered: {
    backgroundColor: `rgba(${smColors.greenRgb}, 0.1)`
  },
  disabled: {
    border: `1px solid ${smColors.borderGray}`,
    cursor: 'default'
  },
  disabledText: {
    color: smColors.borderGray
  }
};

const imageStyle = { height: 40, width: 40 };

export default class SendReceiveButton extends React.Component<SendReceiveButtonProps, SendReceiveButtonState> {
  state = {
    hovered: false
  };

  render() {
    const { disabled, onPress } = this.props;

    return (
      <div style={{ ...styles.root, ...this.rootStyles() }}>
        <div style={styles.buttonWrapper} onClick={disabled ? undefined : onPress}>
          <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
            {this.renderReceiveButtonElem()}
          </div>
        </div>
      </div>
    );
  }

  renderReceiveButtonElem = () => {
    const { title } = this.props;
    return (
      <div style={styles.button}>
        <img src={this.getImageSource()} style={imageStyle} alt="Missing icon" />
        <div style={styles.buttonTextContainer}>
          <span style={{ ...styles.buttonText, ...this.sendReceiveButtonDisabledStyle() }}>{title}</span>
        </div>
      </div>
    );
  };

  getImageSource = () => {
    const { disabled, title } = this.props;
    if (disabled) {
      return title === 'Send coins' ? sendImageSourceDisabled : receiveImageSourceDisabled;
    } else {
      return title === 'Send coins' ? sendImageSource : receiveImageSource;
    }
  };

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  sendReceiveButtonDisabledStyle = () => {
    const { disabled } = this.props;
    return disabled ? styles.disabledText : {};
  };

  rootStyles = () => {
    const { disabled } = this.props;
    const { hovered } = this.state;
    if (disabled) {
      return styles.disabled;
    }
    if (hovered) {
      return styles.hovered;
    }
    return {};
  };
}
