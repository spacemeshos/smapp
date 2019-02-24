// @flow
import React from 'react';
import { smFonts as Fonts, smColors as Colors } from '../../../vars';
import styles from './SmInput.css';

const INPUT_PLACEHOLDER = 'Type here';

const inlineStyles = {
  wrapper: {
    border: `1px solid ${Colors.green}`
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
    color: Colors.black,
    ...Fonts.font2,
    border: `1px solid ${Colors.borderGray}`
  },
  focused: {
    border: `1px solid ${Colors.green}`
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
    const { inFocus } = this.state;
    const focusedStyle = () => (inFocus ? inlineStyles.focused : {});
    const disabledStyle = () => (disabled ? inlineStyles.disabled : {});

    const textInputElem = () => (
      <input
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        disabled={disabled}
        onChange={this.handleChangeText}
        className={styles.noOutline}
        placeholder={placeholder || INPUT_PLACEHOLDER}
        data-tid="noOutline"
        style={{ ...inlineStyles.normal, ...disabledStyle(), ...focusedStyle() }}
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
}
