// @flow
import React from 'react';
import { smFonts, smColors } from '../../../vars';

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
    border: `1px solid ${smColors.borderGray}`,
    borderRadius: 2,
    padding: 6,
    paddingTop: 12
  },
  radioInner: {
    position: 'relative',
    height: 20,
    width: 20,
    borderRadius: 10,
    border: `1px solid ${smColors.borderGray}`
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
    backgroundColor: smColors.green,
    transition: 'all .2s linear'
  },
  hoveredCenter: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 10,
    width: 10,
    borderRadius: 6,
    backgroundColor: `rgba(${smColors.greenRgb}, 0.2)`
  },
  labelWrapper: {
    paddingLeft: 8
  },
  labelText: {
    ...smFonts.fontNormal16,
    color: smColors.black
  },
  disabledLabelText: {
    color: smColors.textGray
  }
};

export default class SmRadioButtons extends React.Component<SmRadioButtonProps, SmRadioButtonState> {
  state = {
    radioSelected: -1,
    hovered: -1
  };

  render() {
    const { data, disabled } = this.props;

    return (
      <div style={{ ...styles.root, ...this.rootDisabledStyle() }}>
        {data.map((val) => (
          <div key={val.id} onClick={disabled || val.disabled ? undefined : this.radioClick.bind(this, val.id)}>
            <div onMouseEnter={this.handleMouseEnter.bind(this, val.id)} onMouseLeave={this.handleMouseLeave}>
              {this.renderRadioButtonElem(val)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderRadioButtonElem = (val: RadioEntry) => {
    const { disabled } = this.props;
    const { radioSelected, hovered } = this.state;
    return (
      <div style={{ ...styles.radioOuter, ...this.outerStyle(val) }}>
        <div style={styles.radioInner}>
          {!val.disabled && val.id === radioSelected ? <div style={styles.selected} /> : null}
          {!disabled && !val.disabled && val.id !== radioSelected && val.id === hovered ? <div style={styles.hoveredCenter} /> : null}
        </div>
        <div style={styles.labelWrapper}>
          <span style={{ ...styles.labelText, ...this.textLabelDisabledStyle(val) }}>{val.label}</span>
        </div>
      </div>
    );
  };

  handleMouseEnter = (id: number | string) => {
    this.setState({ hovered: id });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: undefined });
  };

  outerStyle = (val: RadioEntry) => {
    const { radioSelected } = this.state;
    if (!val.disabled && radioSelected === val.id) {
      return {
        borderColor: smColors.green,
        backgroundColor: `rgba(${smColors.greenRgb}, 0.1)`
      };
    }
    if (val.disabled) {
      return {
        borderColor: smColors.borderGray,
        backgroundColor: smColors.white,
        cursor: 'default'
      };
    }
    return { borderColor: smColors.borderGray, backgroundColor: smColors.white };
  };

  rootDisabledStyle = () => {
    const { disabled } = this.props;
    return disabled ? styles.disabled : {};
  };

  radioClick(id: number | string) {
    const { data, onPress } = this.props;
    const entry: ?RadioEntry = data.find((radioEntry: RadioEntry) => radioEntry.id === id);

    let label: string = '';
    if (entry) {
      /* eslint-disable-next-line prefer-destructuring */
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

  textLabelDisabledStyle = (val: RadioEntry) => {
    const { disabled } = this.props;
    return disabled || val.disabled ? styles.disabledLabelText : {};
  };
}
