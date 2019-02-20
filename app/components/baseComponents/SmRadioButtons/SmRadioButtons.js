// @flow
import * as React from 'react';
import Fonts from '../../../vars/fonts';
import Colors from '../../../vars/colors';

export type RadioEntry = {
  id: number | string,
  label: string,
  disabled?: boolean
};

type SmRadioButtonProps = {
  onPress: (selection: RadioEntry) => void,
  data: RadioEntry[],
  disabled?: boolean
};

type SmRadioButtonState = {
  radioSelected: number | string,
  hovered: number | string
};

export default class SmRadioButtons extends React.Component<SmRadioButtonProps, SmRadioButtonState> {
  constructor(props: SmRadioButtonProps) {
    super(props);
    this.state = {
      radioSelected: -1,
      hovered: -1
    };
  }

  render() {
    const { data, disabled } = this.props;
    const { radioSelected, hovered } = this.state;

    const styles = {
      root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'inherit',
        cursor: 'pointer',
        userSelect: 'none'
      },
      radioOuter: {
        display: 'flex',
        flexDirection: 'row',
        border: `1px solid ${Colors.borderGray}`,
        borderRadius: 2,
        padding: 6,
        paddingTop: 12
      },
      radioInner: {
        position: 'relative',
        height: 20,
        width: 20,
        borderRadius: 10,
        border: `1px solid ${Colors.borderGray}`
      },
      disabled: {
        opacity: 0.4,
        cursor: 'default'
      },
      selected: {
        position: 'absolute',
        top: 1,
        left: 1,
        height: 16,
        width: 16,
        borderRadius: 10,
        backgroundColor: Colors.green,
        transition: 'all .2s linear'
      },
      hoveredCenter: {
        position: 'absolute',
        top: 4,
        left: 4,
        height: 10,
        width: 10,
        borderRadius: 6,
        backgroundColor: `rgba(${Colors.greenRgb}, 0.2)`
      },
      labelWrapper: {
        paddingLeft: 8
      },
      labelText: {
        ...Fonts.font2,
        color: Colors.black
      },
      disabledLabelText: {
        color: Colors.textGray
      }
    };

    const outerStyle = (val) => {
      if (!val.disabled && radioSelected === val.id) {
        return {
          borderColor: Colors.green,
          backgroundColor: `rgba(${Colors.greenRgb}, 0.1)`
        };
      }
      if (val.disabled) {
        return {
          borderColor: Colors.borderGray,
          backgroundColor: Colors.white,
          cursor: 'default'
        };
      }
      return { borderColor: Colors.borderGray, backgroundColor: Colors.white };
    };

    const textLabelDisabledStyle = (val: RadioEntry) => {
      if (disabled || val.disabled) {
        return styles.disabledLabelText;
      }
      return {};
    };

    const radioButtonElem = (val: RadioEntry) => (
      <div style={{ ...styles.radioOuter, ...outerStyle(val) }}>
        <div style={styles.radioInner}>
          {!val.disabled && val.id === radioSelected ? <div style={styles.selected} /> : null}
          {!disabled && !val.disabled && val.id !== radioSelected && val.id === hovered ? <div style={styles.hoveredCenter} /> : null}
        </div>
        <div style={styles.labelWrapper}>
          <span style={{ ...styles.labelText, ...textLabelDisabledStyle(val) }}>{val.label}</span>
        </div>
      </div>
    );

    const rootDisabledStyle = () => {
      if (disabled) {
        return styles.disabled;
      }
      return {};
    };

    return (
      <div style={{ ...styles.root, ...rootDisabledStyle() }}>
        {data.map((val) => (
          <div key={val.id} onClick={disabled || val.disabled ? undefined : this.radioClick.bind(this, val.id)}>
            <div onMouseEnter={this.handleMouseEnter.bind(this, val.id)} onMouseLeave={this.handleMouseLeave}>
              {radioButtonElem(val)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  handleMouseEnter = (id: number | string) => {
    this.setState({ hovered: id });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: undefined });
  };

  radioClick(id: number | string) {
    const { data, onPress } = this.props;
    const entry: ?RadioEntry = data.find((radioEntry: RadioEntry) => radioEntry.id === id);

    let label: string = '';
    if (entry) {
      label = entry.label;
    }
    this.setState(
      {
        radioSelected: id,
        hovered: id
      },
      () => onPress({ id, label })
    );
  }
}
