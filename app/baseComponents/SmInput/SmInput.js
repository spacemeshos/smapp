// @flow
import React from 'react';
import { smFonts, smColors } from '/vars';
import styles from './SmInput.css';

const INPUT_PLACEHOLDER = 'Type here';

const inlineStyles = {
  wrapper: {
    border: `1px solid ${smColors.green}`
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    minHeight: 30
  },
  normal: {
    height: 44,
    paddingLeft: 8,
    borderRadius: 2,
    color: smColors.black,
    ...smFonts.fontNormal16,
    border: `1px solid ${smColors.borderGray}`
  },
  focused: {
    border: `1px solid ${smColors.green}`
  },
  disabled: {
    opacity: 0.4
  }
};

type SmInputProps = {
  placeholder?: string,
  disabled?: boolean,
  onChangeText?: (text: string) => void
};

type SmInputState = {
  inFocus: boolean
};

export default class SmInput extends React.Component<SmInputProps, SmInputState> {
  state = {
    inFocus: false
  };

  render() {
    const { placeholder, disabled } = this.props;

    const textInputElem = () => (
      <input
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={disabled}
        onChange={this.handleChangeText}
        className={styles.noOutline}
        placeholder={placeholder || INPUT_PLACEHOLDER}
        data-tid="noOutline"
        style={{ ...inlineStyles.normal, ...this.disabledStyle(), ...this.focusedStyle() }}
      />
    );

    return <div>{textInputElem()}</div>;
  }

  handleFocus = () => {
    this.setState({ inFocus: true });
  };

  handleBlur = () => {
    this.setState({ inFocus: false });
  };

  handleChangeText = (e: Event) => {
    const { onChangeText } = this.props;
    if (e.target instanceof HTMLInputElement && onChangeText) {
      onChangeText(e.target.value);
    }
  };

  focusedStyle = () => {
    const { inFocus } = this.state;
    return inFocus ? inlineStyles.focused : {};
  };

  disabledStyle = () => {
    const { disabled } = this.props;
    return disabled ? inlineStyles.disabled : {};
  };
}
