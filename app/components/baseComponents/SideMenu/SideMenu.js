// @flow

import React from 'react';
import Colors from '../../../vars/colors';
import Fonts from '../../../vars/fonts';
import SmallLoader from '../SmallLoader/SmallLoader';
import * as menu1 from '../../../assets/images/menu_1@2x.png';
import * as menu2 from '../../../assets/images/menu_2@2x.png';
import * as menu3 from '../../../assets/images/menu_3@2x.png';
import * as menu4 from '../../../assets/images/menu_4@2x.png';
import * as menu5 from '../../../assets/images/menu_5@2x.png';
import * as menu6 from '../../../assets/images/menu_6@2x.png';
import * as openIcon from '../../../assets/images/open@2x.png';

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
    const { width, selectedId, hoveredId, isOpen } = this.state;
    const { loadingEntry } = this.props;
    const rootStyle = {
      border: `1px solid ${Colors.borderGray}`,
      borderRadius: 0,
      height: '100vh',
      width,
      overflow: 'hidden',
      transition: 'width .2s linear'
    };

    const styles = {
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
        ...Fonts.font6,
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
        left: isOpen ? width - 48 : 24,
        height: 22,
        width: 12,
        transform: `rotate(${isOpen ? '180' : '0'}deg)`,
        transition: 'all .2s linear'
      },
      top: {},
      bottom: {
        borderTop: `1px solid ${Colors.borderGray}`
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

    const selectedEntryStyle = (entryId: number): InlineStyle => (entryId === selectedId ? { backgroundColor: Colors.green } : { backgroundColor: Colors.white });

    const entryStyle = (entryId: number, isEntryDisabled: boolean): InlineStyle => {
      if (isEntryDisabled) {
        return { cursor: 'default', opacity: 0.5 };
      }
      if (entryId === selectedId) {
        return { backgroundColor: Colors.lightGray };
      }
      if (entryId === hoveredId) {
        return { opacity: 0.7 };
      }
      return {};
    };

    const toggleStyle = (): InlineStyle => {
      const { hovered } = this.state;
      return hovered ? { opacity: 0.7 } : {};
    };

    const menuEntryInnerElem = (entry: SideMenuEntry) => (
      <div style={{ ...styles.entry, ...entryStyle(entry.id, !!entry.disabled) }}>
        <div style={{ ...styles.selector, ...selectedEntryStyle(entry.id) }} />
        <div style={styles.iconWrapper}>
          <img src={entry.iconSrc} style={styles.icon} alt="Icon missing" />
        </div>
        <span style={styles.entryText}>{entry.label}</span>
        <div style={styles.loadingIconWrapper}>{loadingEntry && loadingEntry.id === entry.id && <SmallLoader isLoading={loadingEntry.isLoading} />}</div>
      </div>
    );

    const menuEntryElem = (entry: SideMenuEntry) => (
      <div key={entry.id} onClick={this.handleSelectEntry.bind(this, entry)}>
        <div onMouseEnter={this.handleEntryMouseEnter.bind(this, entry.id)} onMouseLeave={this.handleEntryMouseLeave}>
          {menuEntryInnerElem(entry)}
        </div>
      </div>
    );

    const topOrBottomElem = (topOrBottom: 'top' | 'bottom') => (
      <div style={styles[topOrBottom]}>{menuEntries[topOrBottom].map((entry: SideMenuEntry) => menuEntryElem(entry))}</div>
    );

    const menuElem = () => (
      <div style={styles.menu}>
        {topOrBottomElem('top')}
        {topOrBottomElem('bottom')}
      </div>
    );

    const toggleElem = () => (
      <div style={{ ...styles.toggleOuter, ...toggleStyle() }}>
        <div style={styles.toggleWrapper}>
          <img src={openIcon} style={styles.toggle} alt="Icon missing" />
        </div>
      </div>
    );

    return (
      <div style={rootStyle}>
        <div style={styles.entry} onClick={this.handleSideMenuToggle} onMouseEnter={this.handleToggleMouseEnter} onMouseLeave={this.handleToggleMouseLeave}>
          {toggleElem()}
        </div>
        {menuElem()}
      </div>
    );
  }

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
}
