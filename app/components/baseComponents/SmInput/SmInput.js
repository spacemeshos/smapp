// @flow
import * as React from 'react';
import Colors from '../../../vars/colors';
import Fonts from '../../../vars/fonts';
import styles from "./SmInput.css";

const INPUT_PLACEHOLDER = 'Type here';

const inlineStyles = {
    wrapper: {
        border: `1px solid ${Colors.green}`
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        minHeight: 30,
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
    }
};

type SmInputProps = {
    placeholder: string,
    disabled?: boolean,
    onChangeText?: (text: string) => void
};

type SmInputState = {
    inFocus: boolean,
};

export default class SmInput extends React.Component<any,SmInputState> {
    constructor(props: any) {
        super(props);
        this.state = {
            inFocus: false,
        }
    }

    handleFocus = () => {
        this.setState({ inFocus: true });
    }

    handleBlur = () => {
        this.setState({ inFocus: false });
    }

    handleChangeText = (e: any) => {
        const { onChangeText } = this.props;
        if (onChangeText) {
            onChangeText(e.target.value)
        }
    }

    render() {
        const {placeholder, disabled} = this.props;
        const {inFocus} = this.state;

        const focusedStyle = () => {
          if (inFocus) {
            return inlineStyles.focused;
          }
          return {};
        }

        const textInputElem = () => <input
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChangeText}
            className={styles.noOutline}
            placeholder={placeholder || INPUT_PLACEHOLDER}
            data-tid="noOutline"
            style={{...inlineStyles.normal, ...focusedStyle()}}
        />;

        return <div>
            <div>{textInputElem()}</div>
        </div>
    }
}
