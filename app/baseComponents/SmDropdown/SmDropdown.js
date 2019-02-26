// @flow
import React from 'react';
import { smFonts, smColors } from '/vars';
import { openDDIcon, openDDIconDisabled } from '/assets/images';
import styled from 'styled-components';

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
  hoveredHeader: boolean,
  itemsHeight: number
};

// $FlowStyledIssue
const StyledAction = styled.div`
  &:hover {
    background-color: ${smColors.hoverLightGreen};
  }
  &:active {
    background-color: ${smColors.actionLightGreen};
  }
`;

// $FlowStyledIssue
const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
  width: ${({ width }) => width}px;
  cursor: pointer;
  user-select: none;
  position: relative;
  opacity: 1;
  background-color: ${smColors.white};
  ${({ disabled }) =>
    disabled &&
    `
      cursor: default;
      pointer-events: none;
      opacity: 0.6;
  `};
`;

// $FlowStyledIssue
const StyledHeaderWrapper = styled(StyledAction)`
  z-index: 0;
  overflow: hidden;
  padding-left: 20px;
  height: ${ROW_HEIGHT}px;
  padding-top: 4px;
  border: 1px solid ${smColors.borderGray};
  border-radius: 2px;
  ${({ isOpen }) =>
    isOpen &&
    `
    border: 1px solid ${smColors.darkGreen};
    border-radius: 2px 2px 0 0;
    box-shadow: 1px 2px 9px ${smColors.textGray};
  `}
`;

const StyledIconWrapper = styled.div`
  position: relative;
`;

// $FlowStyledIssue
const StyledIcon = styled.img`
  position: absolute;
  top: 16px;
  right: 20px;
  height: 6px;
  width: 10px;
  z-index: 999;
  transform: rotate(${({ isOpen }) => (isOpen ? '0' : '180')}deg);
  transition: transform 0.2s linear;
`;

// $FlowStyledIssue
const StyledItemsWrapper = styled.div`
  position: absolute;
  top: ${ROW_HEIGHT - 2}px;
  z-index: 100;
  overflow: hidden;
  border: 1px solid ${smColors.darkGreen};
  border-top: 1px solid ${smColors.borderGray};
  transition: all 0.2s linear;
  overflow-y: scroll;
  width: ${({ width }) => width}px;
  max-height: ${({ height }) => height}px;
  border-radius: 0 0 2px 2px;
  cursor: auto;
  box-shadow: 1px 2px 9px ${smColors.textGray};
`;

const StyledBaseLabelText = styled.span`
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize}px;
  font-weight: ${smFonts.fontNormal16.fontWeight};
  color: smColors.black;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// $FlowStyledIssue
const StyledHeaderText = styled(StyledBaseLabelText)`
  ${({ disabled }) =>
    disabled &&
    `
    color: ${smColors.textGray};
    pointer-events: none;
  `};
`;

// $FlowStyledIssue
const StyledDropdownEntry = styled(StyledAction)`
  border-top: 1px solid ${smColors.borderGray};
  padding-left: 20px;
  height: ${ROW_HEIGHT}px;
  background-color: ${smColors.white};
  opacity: 1;
  padding-top: 4px;
  cursor: pointer;
  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    cursor: default;
  `};
`;

// $FlowStyledIssue
const StyledDropdownEntryText = styled(StyledBaseLabelText)`
  ${({ disabled }) =>
    disabled &&
    `
    color: ${smColors.textGray};
  `};
`;

export default class SmDropdown extends React.Component<SmDropdownProps, SmDropdownState> {
  state: SmDropdownState = {
    isOpen: false,
    selectedEntryId: -1,
    hoveredHeader: false,
    itemsHeight: ROW_HEIGHT
  };

  render() {
    const { data, disabled, placeholder } = this.props;
    const { selectedEntryId, isOpen, itemsHeight, hoveredHeader } = this.state;
    const selectedEntry: ?DropdownEntry = this._getEntryByID(selectedEntryId);
    const actualWidth = this._getWidth();

    return (
      <StyledRoot disabled={disabled} width={actualWidth}>
        <StyledHeaderWrapper isOpen={isOpen} onClick={this.handleToggle}>
          <StyledIconWrapper>
            <StyledIcon isOpen={itemsHeight === ROW_HEIGHT} src={isOpen || hoveredHeader ? openDDIcon : openDDIconDisabled} alt="Icon missing" />
          </StyledIconWrapper>
          <StyledHeaderText disabled={disabled}>{selectedEntry ? selectedEntry.label : placeholder || DEFAULT_PLACEHOLDER}</StyledHeaderText>
        </StyledHeaderWrapper>
        {isOpen && (
          <StyledItemsWrapper width={actualWidth} height={itemsHeight}>
            {data.map((val) => this.renderDropdownEntryElem(val, disabled))}
          </StyledItemsWrapper>
        )}
      </StyledRoot>
    );
  }

  renderDropdownEntryElem = (val: DropdownEntry, disabled?: boolean) => {
    return (
      <StyledDropdownEntry
        disabled={!!val.disabled}
        key={val.id}
        onClick={(e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          if (!(disabled || val.disabled)) {
            this.handleSelect(val.id);
          }
        }}
      >
        <StyledDropdownEntryText disabled={val.disabled}>{val.label}</StyledDropdownEntryText>
      </StyledDropdownEntry>
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
        selectedEntryId: id
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
