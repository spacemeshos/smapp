// @flow
import React from 'react';
import { smFonts, smColors } from '/vars';
import { openDDIcon, openDDIconDisabled } from '/assets/images';

const DEFAULT_PLACEHOLDER: string = 'Please Select...';
const ROW_HEIGHT: number = 44;
const DEFAULT_MAX_ITEMS_HEIGHT: number = ROW_HEIGHT * 6 + 6;

export type DropdownEntry = {
  id: number | string,
  label: string,
  disabled?: boolean
};

type SmDropdownProps = {
  onPress: (selection: DropdownEntry) => void,
  data: DropdownEntry[],
  disabled?: boolean,
  placeholder?: string,
  width?: number | string,
  maxItemsHeight?: number
};

type SmDropdownState = {
  isOpen: boolean,
  selectedEntryId: number | string,
  hovered: number | string,
  hoveredHeader: boolean,
  itemsHeight: number
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'inherit',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    opacity: 1,
    backgroundColor: smColors.white
  },
  header: {
    zIndex: 0,
    overflow: 'hidden',
    paddingLeft: 20,
    height: ROW_HEIGHT,
    paddingTop: 4
  },
  disabled: {
    opacity: 0.4,
    cursor: 'default'
  },
  labelWrapper: {
    paddingLeft: 20,
    height: ROW_HEIGHT,
    paddingTop: 4
  },
  entryOuter: {
    borderTop: `1px solid ${smColors.borderGray}`,
    backgroundColor: smColors.white,
    opacity: 1
  },
  labelText: {
    ...smFonts.fontNormal16,
    color: smColors.black,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  labelTextDisabled: {
    color: smColors.textGray
  },
  disabledLabelText: {
    color: smColors.textGray
  },
  itemsWrapper: {
    position: 'absolute',
    top: ROW_HEIGHT - 2,
    zIndex: 100,
    overflow: 'hidden',
    border: `1px solid ${smColors.darkGreen}`,
    borderTop: `1px solid ${smColors.borderGray}`,
    transition: 'all .2s linear',
    overflowY: 'scroll'
  },
  iconWrapper: {
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    top: 16,
    right: 12,
    height: 6,
    width: 10,
    transition: 'transform .2s linear',
    zIndex: 999
  }
};

export default class SmDropdown extends React.Component<SmDropdownProps, SmDropdownState> {
  state: SmDropdownState = {
    isOpen: false,
    selectedEntryId: -1,
    hovered: -1,
    hoveredHeader: false,
    itemsHeight: ROW_HEIGHT
  };

  render() {
    const { data, disabled, placeholder } = this.props;
    const { selectedEntryId, isOpen, itemsHeight, hoveredHeader } = this.state;
    const selectedEntry: ?DropdownEntry = this._getEntryByID(selectedEntryId);

    return (
      <div style={{ ...styles.root, width: this._getWidth(), ...this.rootDisabledStyle() }}>
        <div
          style={{
            ...styles.header,
            border: `1px solid ${isOpen ? smColors.darkGreen : smColors.borderGray}`,
            borderRadius: `2px 2px ${isOpen ? '0 0' : '2px 2px'}`,
            ...this.headerStyle()
          }}
          onClick={this.handleToggle}
          onMouseEnter={this.handleHeaderEnter}
          onMouseLeave={this.handleHeaderLeave}
        >
          <div style={styles.iconWrapper}>
            <img
              src={isOpen || hoveredHeader ? openDDIcon : openDDIconDisabled}
              style={{ ...styles.icon, transform: `rotate(${itemsHeight === ROW_HEIGHT ? '0' : '180'}deg)` }}
              alt="Icon missing"
            />
          </div>
          <span style={{ ...styles.labelText, ...this.textLabelDisabledStyle() }}>{selectedEntry ? selectedEntry.label : placeholder || DEFAULT_PLACEHOLDER}</span>
        </div>
        {isOpen && (
          <div style={{ ...styles.itemsWrapper, width: this._getWidth(), maxHeight: itemsHeight, borderRadius: `${isOpen ? '0 0' : '2px 2px'} 2px 2px` }}>
            {data.map((val) => (
              <div
                key={val.id}
                onClick={(e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!(disabled || val.disabled)) {
                    this.handleSelect(val.id);
                  }
                }}
              >
                <div onMouseEnter={this.handleMouseEnter.bind(this, val.id)} onMouseLeave={this.handleMouseLeave}>
                  {this.renderDropdownEntryElem(val)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  renderDropdownEntryElem = (val: DropdownEntry) => {
    return (
      <div style={styles.entryOuter}>
        <div style={{ ...styles.labelWrapper, ...this.labelWrapperStyle(val) }}>
          <span style={{ ...styles.labelText, ...this.textLabelDisabledStyle(val) }}>{val.label}</span>
        </div>
      </div>
    );
  };

  componentDidUpdate() {
    const { isOpen } = this.state;
    setTimeout(() => {
      if (isOpen) {
        window.addEventListener('click', this.closeDropdown);
      } else {
        window.removeEventListener('click', this.closeDropdown);
      }
    }, 0);
  }

  handleMouseEnter = (id: number | string) => {
    this.setState({ hovered: id });
  };

  handleMouseLeave = () => {
    this.setState({ hovered: -1 });
  };

  handleHeaderEnter = () => {
    const { disabled } = this.props;
    if (!disabled) {
      this.setState({ hoveredHeader: true });
    }
  };

  handleHeaderLeave = () => {
    this.setState({ hoveredHeader: false });
  };

  handleSelect(id: number | string) {
    const { onPress } = this.props;
    const entry: ?DropdownEntry = this._getEntryByID(id);
    let label: string = '';
    if (entry) {
      /* eslint-disable-next-line prefer-destructuring */
      label = entry.label;
    }
    this.setState(
      {
        selectedEntryId: id,
        hovered: id
      },
      () => {
        onPress({ id, label });
        this.closeDropdown();
      }
    );
  }

  handleToggle = () => {
    const { isOpen } = this.state;
    const { disabled } = this.props;
    if (disabled) {
      return;
    }

    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  };

  _getEntryByID = (id: string | number): ?DropdownEntry => {
    const { data } = this.props;
    return data.find((dropdownEntry: DropdownEntry) => dropdownEntry.id === id);
  };

  _getWidth = (): number | string => {
    const { width, data } = this.props;
    const LETTER_WIDTH = 10;
    if (!width) {
      const maxLength = data.reduce((max, entry: DropdownEntry) => {
        return Math.max(max, entry.label.length);
      }, 0);
      return maxLength * LETTER_WIDTH;
    } else {
      return width;
    }
  };

  closeDropdown = () => {
    this.setState({ itemsHeight: ROW_HEIGHT }, () => {
      setTimeout(() => {
        this.setState({ isOpen: false });
      }, 200);
    });
  };

  openDropdown = () => {
    const { maxItemsHeight } = this.props;
    this.setState({ isOpen: true, itemsHeight: 0 }, () => {
      setTimeout(() => {
        this.setState({ itemsHeight: maxItemsHeight || DEFAULT_MAX_ITEMS_HEIGHT });
      });
    });
  };

  labelWrapperStyle = (val: DropdownEntry) => {
    const { hovered, selectedEntryId } = this.state;
    if (!val.disabled && hovered === val.id) {
      return {
        backgroundColor: `rgba(${smColors.greenRgb},0.1)`
      };
    }

    if (!val.disabled && selectedEntryId === val.id) {
      return {
        borderColor: smColors.green,
        backgroundColor: smColors.white
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

  textLabelDisabledStyle = (val?: DropdownEntry) => {
    const { disabled } = this.props;
    return disabled || (!!val && val.disabled) ? styles.disabledLabelText : {};
  };

  rootDisabledStyle = () => {
    const { disabled } = this.props;
    return disabled ? styles.disabled : {};
  };

  headerStyle = () => {
    const { hoveredHeader } = this.state;
    return hoveredHeader ? { backgroundColor: `rgba(${smColors.greenRgb},0.1)` } : {};
  };
}
