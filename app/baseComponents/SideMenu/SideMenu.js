// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors, smFonts } from '/vars';
import SmallLoader from '/baseComponents/SmallLoader/SmallLoader';
import { menu1, menu2, menu3, menu4, menu5, menu6, openIcon } from '/assets/images';

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
  path: ?string,
  disabled?: boolean
};

type SideMenuProps = {
  isOpenOnInit?: boolean,
  initialSelectedId?: number,
  loadingEntry?: LoadingEntry,
  onPress: (entry: SideMenuEntry) => void
};

type SideMenuState = {
  isOpen: boolean,
  selectedId: number,
  width: number
};

const menuEntries: { top: SideMenuEntry[], bottom: SideMenuEntry[] } = {
  top: [
    {
      id: 1,
      label: 'Full Node',
      path: null,
      iconSrc: menu1
    },
    {
      id: 2,
      label: 'Wallet',
      path: '/root/wallet',
      iconSrc: menu2
    },
    {
      id: 3,
      label: 'Transaction',
      path: null,
      iconSrc: menu3
    },
    {
      id: 4,
      label: 'Contacts',
      path: null,
      iconSrc: menu4
    }
  ],
  bottom: [
    {
      id: 5,
      label: 'Settings',
      path: null,
      iconSrc: menu5
    },
    {
      id: 6,
      label: 'Network',
      path: '/root/story-book',
      iconSrc: menu6
    }
  ]
};

const StyledAction = styled.div`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

// $FlowStyledIssue
const StyledSideMenuRoot = styled.div`
  border: 1px solid ${smColors.borderGray};
  border-radius: 0;
  height: 100vh;
  width: ${({ width }) => width}px;
  overflow: hidden;
  transition: width 0.2s linear;
`;

const StyledToggleWrapper = styled(StyledAction)`
  width: ${ENTRY_WIDTH}px;
  height: ${ENTRY_HEIGHT}px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  cursor: pointer;
`;

// $FlowStyledIssue
const StyledToggle = styled.img`
  position: absolute;
  top: 12px;
  height: 22px;
  width: 12px;
  transition: all 0.2s linear;
  left: ${({ isOpen, width }) => (isOpen ? width - 48 : 24)}px;
  transform: rotate(${({ isOpen }) => (isOpen ? '180' : '0')}deg);
`;

const StyledMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - ${ENTRY_HEIGHT}px);
`;

// $FlowStyledIssue
const StyledTopOrBottomWrapper = styled.div`
  border-top: 1px solid ${({ topOrBottom }) => (topOrBottom === 'bottom' ? smColors.borderGray : 'transparent')};
`;

// $FlowStyledIssue
const StyledMenuEntryWrapper = styled(StyledAction)`
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
`;

// $FlowStyledIssue
const StyledMenuEntry = styled.div`
  width: ${ENTRY_WIDTH}px;
  height: ${ENTRY_HEIGHT}px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  div :first-child {
    width: 12px;
    background-color: ${({ isSelected }) => (isSelected ? smColors.green : smColors.white)};
    transition: all 0.2s linear;
  }
`;

const StyledIconWrapper = styled.div`
  height: 24px;
  width: 24px;
  position: relative;
`;

const StyledIcon = styled.img`
  height: 80%;
  width: 80%;
  position: absolute;
  top: 17px;
  left: 6px;
`;

const StyledLabel = styled.span`
  font-family: ${smFonts.fontLight12.fontFamily};
  font-size: ${smFonts.fontLight12.fontSize}px;
  font-weight: ${smFonts.fontLight12.fontWeight};
`;

const StyledLabelWrapper = styled.div`
  padding-top: 16px;
  padding-left: 24px;
  user-select: none;
`;

const StyledLoadingIconWrapper = styled.div`
  position: relative;
`;

export default class SideMenu extends React.Component<SideMenuProps, SideMenuState> {
  constructor(props: SideMenuProps) {
    super(props);
    this.state = {
      isOpen: !!props.isOpenOnInit,
      selectedId: -1,
      width: props.isOpenOnInit ? ENTRY_WIDTH : ENTRY_WIDTH_CLOSED
    };
  }

  render() {
    const { width, isOpen } = this.state;

    return (
      <StyledSideMenuRoot width={width}>
        <StyledToggleWrapper onClick={this.handleSideMenuToggle}>
          <StyledToggle isOpen={isOpen} width={width} src={openIcon} alt="Icon missing" />
        </StyledToggleWrapper>
        {this.renderMenuElem()}
      </StyledSideMenuRoot>
    );
  }

  renderMenuEntryInnerElem = (entry: SideMenuEntry) => {
    const { isOpen, selectedId } = this.state;
    const { loadingEntry } = this.props;
    return (
      <StyledMenuEntry isSelected={entry.id === selectedId}>
        <div />
        <StyledIconWrapper>
          <StyledIcon src={entry.iconSrc} alt="Icon missing" />
        </StyledIconWrapper>
        <StyledLabelWrapper>
          <StyledLabel>{entry.label}</StyledLabel>
        </StyledLabelWrapper>
        <StyledLoadingIconWrapper>
          {loadingEntry && loadingEntry.id === entry.id && (
            <SmallLoader isLoading={loadingEntry.isLoading} loadingLeft={isOpen ? 8 : -96} loadingSize={isOpen ? 18 : 25} loadingTop={isOpen ? 16 : 14} />
          )}
        </StyledLoadingIconWrapper>
      </StyledMenuEntry>
    );
  };

  renderTopOrBottomElem = (topOrBottom: 'top' | 'bottom') => (
    <StyledTopOrBottomWrapper topOrBottom={topOrBottom}>
      {menuEntries[topOrBottom].map((entry: SideMenuEntry) => (
        <StyledMenuEntryWrapper key={entry.id} onClick={() => this.handleSelectEntry(entry)} disabled={!!entry.disabled}>
          {this.renderMenuEntryInnerElem(entry)}
        </StyledMenuEntryWrapper>
      ))}
    </StyledTopOrBottomWrapper>
  );

  renderMenuElem = () => (
    <StyledMenuWrapper>
      {this.renderTopOrBottomElem('top')}
      {this.renderTopOrBottomElem('bottom')}
    </StyledMenuWrapper>
  );

  componentDidMount() {
    const { initialSelectedId } = this.props;
    if (typeof initialSelectedId === 'number') {
      const entry = menuEntries.top.find((menuEntry: SideMenuEntry) => initialSelectedId === menuEntry.id);
      entry && this.handleSelectEntry(entry);
    }
  }

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
}
