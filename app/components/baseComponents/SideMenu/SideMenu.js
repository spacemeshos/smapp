// @flow
import React from 'react';
import { smColors, smFonts } from '../../../vars';
import SmallLoader from '../SmallLoader/SmallLoader';
import { menu1, menu2, menu3, menu4, menu5, menu6, openIcon } from '../../../assets/images';

const ENTRY_HEIGHT = 54;
const ENTRY_WIDTH = 172;
const ENTRY_WIDTH_CLOSED = 60;

export type LoadingEntry = {
  id: number,
  isLoading: boolean
};

export type SideMenuEntry = {
  id: number,
  label: string,
  /* eslint-disable-next-line flowtype/no-weak-types */
  iconSrc: any,
  disabled?: boolean
};

type InlineStyle = { [key: string]: string | number };

type SideMenuProps = {
  openOnInit?: boolean,
  loadingEntry?: LoadingEntry,
  onPress: (entry: SideMenuEntry) => void
};

type SideMenuState = {
  isOpen: boolean,
  hovered: boolean,
  hoveredId: number,
  selectedId: number,
  width: number
};

const styles = {
  root: {
    border: `1px solid ${smColors.borderGray}`,
    borderRadius: 0,
    height: '100vh',
    overflow: 'hidden',
    transition: 'width .2s linear'
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: `calc(100% - ${ENTRY_HEIGHT}px)`
  },
  entry: {
    width: 164,
    height: ENTRY_HEIGHT,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  selector: {
    width: 12
  },
  entryText: {
    ...smFonts.fontLight12,
    paddingTop: 20,
    paddingLeft: 24,
    userSelect: 'none'
  },
  toggleOuter: {
    height: ENTRY_HEIGHT,
    opacity: 1,
    cursor: 'pointer'
  },
  toggleWrapper: {},
  toggle: {
    position: 'absolute',
    top: 12,
    height: 22,
    width: 12,
    transition: 'all .2s linear'
  },
  top: {},
  bottom: {
    borderTop: `1px solid ${smColors.borderGray}`
  },
  iconWrapper: {
    height: 24,
    width: 24,
    position: 'relative'
  },
  icon: {
    height: '80%',
    width: '80%',
    position: 'absolute',
    top: 17,
    left: 6
  },
  loadingIconWrapper: {
    position: 'relative'
  }
};

const menuEntries: { top: SideMenuEntry[], bottom: SideMenuEntry[] } = {
  top: [
    {
      id: 1,
      label: 'Full Node',
      iconSrc: menu1,
      disabled: true
    },
    {
      id: 2,
      label: 'Wallet',
      iconSrc: menu2
    },
    {
      id: 3,
      label: 'Transaction',
      iconSrc: menu3
    },
    {
      id: 4,
      label: 'Contacts',
      iconSrc: menu4
    }
  ],
  bottom: [
    {
      id: 5,
      label: 'Settings',
      iconSrc: menu5
    },
    {
      id: 6,
      label: 'Network',
      iconSrc: menu6
    }
  ]
};

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  constructor(props: SideMenuProps) {
    super(props);
    this.state = {
      isOpen: !!props.openOnInit,
      hovered: false,
      hoveredId: -1,
      selectedId: -1,
      width: props.openOnInit ? ENTRY_WIDTH : ENTRY_WIDTH_CLOSED
    };
  }

  render() {
    const { width } = this.state;

    return (
      <div style={{ ...styles.root, width }}>
        <div style={styles.entry} onClick={this.handleSideMenuToggle} onMouseEnter={this.handleToggleMouseEnter} onMouseLeave={this.handleToggleMouseLeave}>
          {this.renderToggleElem()}
        </div>
        {this.renderMenuElem()}
      </div>
    );
  }

  renderToggleElem = () => (
    <div style={{ ...styles.toggleOuter, ...this.toggleOuterStyle() }}>
      <div style={styles.toggleWrapper}>
        <img src={openIcon} style={{ ...styles.toggle, ...this.toggleStyle() }} alt="Icon missing" />
      </div>
    </div>
  );

  renderMenuEntryInnerElem = (entry: SideMenuEntry) => {
    const { isOpen } = this.state;
    const { loadingEntry } = this.props;
    return (
      <div style={{ ...styles.entry, ...this.entryStyle(entry.id, !!entry.disabled) }}>
        <div style={{ ...styles.selector, ...this.selectedEntryStyle(entry.id) }} />
        <div style={styles.iconWrapper}>
          <img src={entry.iconSrc} style={styles.icon} alt="Icon missing" />
        </div>
        <span style={styles.entryText}>{entry.label}</span>
        <div style={styles.loadingIconWrapper}>
          {loadingEntry && loadingEntry.id === entry.id && (
            <SmallLoader isLoading={loadingEntry.isLoading} loadingLeft={isOpen ? 8 : -96} loadingSize={isOpen ? 18 : 25} loadingTop={isOpen ? 18 : 14} />
          )}
        </div>
      </div>
    );
  };

  renderMenuEntryElem = (entry: SideMenuEntry) => (
    <div key={entry.id} onClick={this.handleSelectEntry.bind(this, entry)}>
      <div onMouseEnter={this.handleEntryMouseEnter.bind(this, entry.id)} onMouseLeave={this.handleEntryMouseLeave}>
        {this.renderMenuEntryInnerElem(entry)}
      </div>
    </div>
  );

  renderTopOrBottomElem = (topOrBottom: 'top' | 'bottom') => (
    <div style={styles[topOrBottom]}>{menuEntries[topOrBottom].map((entry: SideMenuEntry) => this.renderMenuEntryElem(entry))}</div>
  );

  renderMenuElem = () => (
    <div style={styles.menu}>
      {this.renderTopOrBottomElem('top')}
      {this.renderTopOrBottomElem('bottom')}
    </div>
  );

  handleEntryMouseEnter = (id: number) => {
    this.setState({ hoveredId: id });
  };

  handleEntryMouseLeave = () => {
    this.setState({ hoveredId: undefined });
  };

  handleSelectEntry = (entry: SideMenuEntry) => {
    const { onPress } = this.props;
    if (!entry.disabled) {
      this.setState({ selectedId: entry.id });
      onPress(entry);
    }
  };

  handleSideMenuToggle = () => {
    const { isOpen } = this.state;
    const endWidth = isOpen ? ENTRY_WIDTH_CLOSED : ENTRY_WIDTH;
    this.setState({ isOpen: !isOpen, width: endWidth });
  };

  handleToggleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  handleToggleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  toggleOuterStyle = (): InlineStyle => {
    const { hovered } = this.state;
    return hovered ? { opacity: 0.7 } : {};
  };

  toggleStyle = (): InlineStyle => {
    const { isOpen, width } = this.state;
    return { left: isOpen ? width - 48 : 24, transform: `rotate(${isOpen ? '180' : '0'}deg)` };
  };

  selectedEntryStyle = (entryId: number): InlineStyle => {
    const { selectedId } = this.state;
    return entryId === selectedId ? { backgroundColor: smColors.green } : { backgroundColor: smColors.white };
  };

  entryStyle = (entryId: number, isEntryDisabled: boolean): InlineStyle => {
    const { selectedId, hoveredId } = this.state;
    if (isEntryDisabled) {
      return { cursor: 'default', opacity: 0.5 };
    }
    if (entryId === selectedId) {
      return { backgroundColor: smColors.lightGray };
    }
    if (entryId === hoveredId) {
      return { opacity: 0.7 };
    }
    return {};
  };
}
