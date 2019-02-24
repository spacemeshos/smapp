// @flow
import React from 'react';
import { smFonts as Fonts, smColors as Colors } from '../../../vars';
import { openDDIcon, openDDIconDisabled } from '../../../assets/images';

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
    const { selectedEntryId, hovered, isOpen, itemsHeight, hoveredHeader } = this.state;
    const selectedEntry: ?DropdownEntry = this._getEntryByID(selectedEntryId);

    const styles = {
      root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'inherit',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        width: this._getWidth(),
        opacity: 1,
        backgroundColor: Colors.white
      },
      header: {
        border: `1px solid ${isOpen ? Colors.darkGreen : Colors.borderGray}`,
        borderRadius: `2px 2px ${isOpen ? '0 0' : '2px 2px'}`,
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
        backgroundColor: Colors.white,
        opacity: 1,
        borderTop: `1px solid ${Colors.borderGray}`
      },
      labelText: {
        ...Fonts.font2,
        color: Colors.black,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      },
      labelTextDisabled: {
        color: Colors.textGray
      },
      disabledLabelText: {
        color: Colors.textGray
      },
      itemsWrapper: {
        position: 'absolute',
        width: this._getWidth(),
        top: ROW_HEIGHT - 2,
        zIndex: 100,
        overflow: 'hidden',
        border: `1px solid ${Colors.darkGreen}`,
        borderTop: `1px solid ${Colors.borderGray}`,
        borderRadius: `${isOpen ? '0 0' : '2px 2px'} 2px 2px`,
        maxHeight: itemsHeight,
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
        transform: `rotate(${itemsHeight === ROW_HEIGHT ? '0' : '180'}deg)`,
        transition: 'transform .2s linear',
        zIndex: 999
      }
    };

    const outerStyle = (isFirst: boolean) => (!isFirst ? { borderTop: `1px solid ${Colors.borderGray}` } : {});

    const labelWrapperStyle = (val: DropdownEntry, isFirst: boolean) => {
      if (!val.disabled && hovered === val.id) {
        return {
          backgroundColor: isFirst ? Colors.white : `rgba(${Colors.greenRgb},0.1)`
        };
      }

      if (!val.disabled && selectedEntryId === val.id) {
        return {
          borderColor: Colors.green,
          backgroundColor: Colors.white
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

    const textLabelDisabledStyle = (val?: DropdownEntry) => (disabled || (!!val && val.disabled) ? styles.disabledLabelText : {});

    const dropdownEntryElem = (val: DropdownEntry, isFirst?: boolean) => (
      <div style={{ ...styles.entryOuter, ...outerStyle(!!isFirst) }}>
        <div style={{ ...styles.labelWrapper, ...labelWrapperStyle(val, !!isFirst) }}>
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

    const headerStyle = () => {
      if (hoveredHeader) {
        return { backgroundColor: `rgba(${Colors.greenRgb},0.1)` };
      }
      return {};
    };

    return (
      <div style={{ ...styles.root, ...rootDisabledStyle() }}>
        <div style={{ ...styles.header, ...headerStyle() }} onClick={this.handleToggle} onMouseEnter={this.handleHeaderEnter} onMouseLeave={this.handleHeaderLeave}>
          <div style={styles.iconWrapper}>
            <img src={isOpen || hoveredHeader ? openDDIcon : openDDIconDisabled} style={styles.icon} alt="Icon missing" />
          </div>
          <span style={{ ...styles.labelText, ...textLabelDisabledStyle() }}>{selectedEntry ? selectedEntry.label : placeholder || DEFAULT_PLACEHOLDER}</span>
        </div>
        {isOpen && (
          <div style={styles.itemsWrapper}>
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
                  {dropdownEntryElem(val)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

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
}
